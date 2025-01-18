import {headers} from "next/headers";
import {NextResponse} from "next/server";
import prisma from "@/lib/db";
import Stripe from "stripe";
import {BookingStatus} from "@prisma/client";
import {sendConfirmationEmail} from "@/app/actions/sendConfirmationEmail";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {apiVersion: "2024-12-18.acacia"});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  console.log("Received webhook event");
  console.log(req);
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature")!;

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const {bookingId, timeSlotId} = session.metadata as {bookingId: string; timeSlotId: string};

        // Get timeslot
        const timeSlot = await prisma.timeSlot.findUnique({
          where: {id: timeSlotId},
          include: {event: true},
        });

        // Get event
        if (!timeSlot) {
          throw new Error("Time slot not found");
        }
        const events = await prisma.event.findUnique({
          where: {id: timeSlot.eventId},
        });

        // Check if early bird price applies
        const isEarlyBird = events!.soldCount < events!.earlyBirdCount;

        // Update booking status
        const booking = await prisma.booking.update({
          where: {id: bookingId},
          data: {
            paymentStatus: "completed",
            stripeSessionId: session.id,
          },
          include: {
            timeSlot: {
              include: {
                event: true,
              },
            },
          },
        });

        // Update timeslot status
        await prisma.timeSlot.update({
          where: {id: timeSlotId},
          data: {status: BookingStatus.UNAVAILABLE},
        });

        // Increment sold teams count
        await prisma.event.update({
          where: {id: booking.timeSlot.event.id},
          data: {
            soldCount: {
              increment: 1,
            },
          },
        });

        // Send confirmation email
        sendConfirmationEmail({
          eventName: events?.type.toString() as "ESCAPE_ROOM" | "CASE_FILE",
          bookingId,
          buyerName: booking.buyerName,
          buyerEmail: booking.buyerEmail,
          buyerTelegram: booking.buyerTelegram,
          teamName: booking.teamName,
          participants: booking.teamMembers.map((member) => ({name: member})),
          timeSlot: booking.timeSlot.startTime,
          price: booking.totalAmount,
          isEarlyBird,
        });

        // Update Google Sheets
        // await updateGoogleSheet(booking);

        break;
      }
      // This will always be triggered when the session is expired regardless of the payment status
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata || {};
        const timeSlotId = metadata.timeSlotId;

        if (!timeSlotId) {
          console.error("No timeSlotId found in session metadata");
          return NextResponse.json(
            {error: "Missing timeSlotId in session metadata"},
            {status: 400},
          );
        }
        try {
          // Check if this session had a successful payment
          const existingSession = await stripe.checkout.sessions.retrieve(session.id);
          if (existingSession.payment_status === "paid") {
            // If payment was successful, don't change anything
            console.log("Session expired but payment was successful, maintaining current status");
            return NextResponse.json({
              received: true,
              message: "Session expired but payment was successful",
            });
          }

          // Get the booking
          const booking = await prisma.booking.findUnique({
            where: {stripeSessionId: session.id},
            include: {
              timeSlot: true,
            },
          });

          // Only proceed with status changes if:
          // 1. Booking exists
          // 2. Payment status is not completed
          // 3. TimeSlot status is not already taken by another booking
          if (
            booking &&
            booking.paymentStatus !== "completed" &&
            booking.timeSlot.status !== BookingStatus.UNAVAILABLE
          ) {
            // Reset timeslot status
            await prisma.timeSlot.update({
              where: {id: timeSlotId},
              data: {status: BookingStatus.AVAILABLE},
            });

            // Update booking status
            await prisma.booking.update({
              where: {
                stripeSessionId: session.id,
              },
              data: {
                paymentStatus: "cancelled",
              },
            });

            console.log("Successfully reset unpaid expired session");
          }

          return NextResponse.json({
            received: true,
            message: "Expired session handled successfully",
          });
        } catch (error) {
          console.error("Error handling expired session:", error);
          return NextResponse.json({error: "Error handling expired session"}, {status: 500});
        }
        break;
      }
    }

    return NextResponse.json({received: true});
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({error: "Webhook handler failed"}, {status: 400});
  }
}

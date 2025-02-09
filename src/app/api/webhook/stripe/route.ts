import {headers} from "next/headers";
import {NextResponse} from "next/server";
import prisma from "@/lib/db";
import Stripe from "stripe";
import {BookingStatus} from "@prisma/client";
import {sendConfirmationEmail} from "@/utils/sendConfirmationEmail";
import {addBookingToSheet} from "@/utils/googleSheets";

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

        if (!session.metadata?.bookingId || !session.metadata?.timeSlotId) {
          throw new Error("Missing required metadata");
        }

        // Parse string IDs to numbers
        const bookingId = parseInt(session.metadata.bookingId, 10);
        const timeSlotId = parseInt(session.metadata.timeSlotId, 10);

        if (isNaN(bookingId) || isNaN(timeSlotId)) {
          throw new Error("Invalid booking or timeSlot ID");
        }

        // Execute updates within a transaction to maintain consistency
        const [booking, updatedTimeSlot, eventChosen, isEarlyBird] = await prisma.$transaction(
          async (tx) => {
            // Fetch the time slot and associated event
            const timeSlot = await tx.timeSlot.findUnique({
              where: {id: timeSlotId},
              include: {event: true},
            });

            if (!timeSlot) {
              throw new Error("Time slot not found");
            }

            const eventChosen = await tx.event.findUnique({
              where: {id: timeSlot.eventId},
            });

            if (!event) {
              throw new Error("Event not found");
            }

            // Update booking payment status
            const updatedBooking = await tx.booking.update({
              where: {id: bookingId},
              data: {
                paymentStatus: "completed",
                stripeSessionId: session.id,
              },
              include: {
                timeSlot: {
                  include: {event: true},
                },
              },
            });

            // Determine early bird pricing
            const isEarlyBird = updatedBooking.totalAmount == eventChosen?.earlyBirdPrice;

            // Update time slot status to UNAVAILABLE
            const updatedTimeSlot = await tx.timeSlot.update({
              where: {id: timeSlotId},
              data: {status: BookingStatus.UNAVAILABLE},
            });

            return [updatedBooking, updatedTimeSlot, eventChosen, isEarlyBird];
          },
        );

        // Send confirmation email
        sendConfirmationEmail({
          eventName: eventChosen?.type.toString() as "ESCAPE_ROOM" | "CASE_FILE",
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
        if (eventChosen) {
          await addBookingToSheet(booking, updatedTimeSlot, eventChosen);
        } else {
          throw new Error("Event not found");
        }

        break;
      }

      // This will always be triggered when the session is expired regardless of the payment status
      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const metadata = session.metadata || {};

        // Parse timeSlotId as number
        const timeSlotId = metadata.timeSlotId ? parseInt(metadata.timeSlotId, 10) : null;

        if (!timeSlotId || isNaN(timeSlotId)) {
          console.error("No valid timeSlotId found in session metadata");
          return NextResponse.json(
            {error: "Missing or invalid timeSlotId in session metadata"},
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
            await prisma.$transaction(async (tx) => {
              // Reset timeslot status
              await tx.timeSlot.update({
                where: {id: timeSlotId},
                data: {status: BookingStatus.AVAILABLE},
              });

              // Delete the booking
              await tx.booking.delete({
                where: {stripeSessionId: session.id},
              });

              // Decrement soldCount safely
              await tx.event.update({
                where: {id: booking.timeSlot.eventId},
                data: {
                  soldCount: {decrement: 1},
                },
              });
            });

            console.log("Successfully deleted unpaid expired session booking");
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

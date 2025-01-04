import {headers} from "next/headers";
import {NextResponse} from "next/server";
import prisma from "@/lib/db";
import Stripe from "stripe";
import {BookingStatus} from "@prisma/client";
// import {sendConfirmationEmail, updateGoogleSheet} from "@/utils/booking";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {apiVersion: "2024-12-18.acacia"});
const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const signature = (await headers()).get("stripe-signature")!;

  try {
    const event = stripe.webhooks.constructEvent(body, signature, webhookSecret);

    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const {bookingId, timeSlotId} = session.metadata as {bookingId: string; timeSlotId: string};

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
        // await sendConfirmationEmail(booking);

        // Update Google Sheets
        // await updateGoogleSheet(booking);

        break;
      }

      case "checkout.session.expired": {
        const session = event.data.object as Stripe.Checkout.Session;
        const {timeSlotId} = session.metadata as {timeSlotId: string};

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

        break;
      }
    }

    return NextResponse.json({received: true});
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({error: "Webhook handler failed"}, {status: 400});
  }
}

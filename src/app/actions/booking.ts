"use server";

import {revalidatePath} from "next/cache";
import prisma from "@/lib/db";
import {EventType, BookingStatus} from "@prisma/client";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-12-18.acacia",
});

export async function getAvailableTimeSlots(eventType: EventType) {
  const event = await prisma.event.findFirst({
    where: {type: eventType},
    include: {
      timeSlots: {
        where: {status: BookingStatus.AVAILABLE},
        orderBy: {startTime: "asc"},
      },
    },
  });

  return event?.timeSlots || [];
}

export async function createBooking(data: {
  timeSlotId: string;
  buyerName: string;
  buyerEmail: string;
  buyerTelegram: string;
  teamMembers: {name: string}[];
}) {
  // Start transaction
  return await prisma.$transaction(async (tx) => {
    // Get time slot and event details
    const timeSlot = await tx.timeSlot.findUnique({
      where: {id: data.timeSlotId},
      include: {event: true},
    });

    if (!timeSlot || timeSlot.status !== "AVAILABLE") {
      throw new Error("Time slot is not available");
    }

    // Check if early bird price applies
    const isEarlyBird = timeSlot.event.soldCount < timeSlot.event.earlyBirdCount;
    const price = isEarlyBird ? timeSlot.event.earlyBirdPrice : timeSlot.event.price;

    // Create booking
    const booking = await tx.booking.create({
      data: {
        timeSlotId: data.timeSlotId,
        buyerName: data.buyerName,
        buyerEmail: data.buyerEmail,
        buyerTelegram: data.buyerTelegram,
        teamMembers: data.teamMembers.map((m) => m.name),
        totalAmount: price,
      },
    });

    // Update time slot status to pending
    await tx.timeSlot.update({
      where: {id: data.timeSlotId},
      data: {status: "PENDING"},
    });

    return {booking, price};
  });
}

// export async function createPaymentIntent(bookingId: string, amount: number) {
//   try {
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: amount * 100, // Convert to cents, refer to stripe docs
//       currency: "sgd",
//       metadata: {bookingId},
//     });

//     await prisma.booking.update({
//       where: {id: bookingId},
//       data: {paymentIntent: paymentIntent.id},
//     });
//     return paymentIntent.client_secret;
//   } catch (error) {
//     console.error("Error creating payment intent:", error);
//     throw new Error("Failed to create payment intent");
//   }
// }

export async function createCheckoutSession(bookingId: string, amount: number) {
  try {
    const booking = await prisma.booking.findUnique({
      where: {id: bookingId},
      include: {timeSlot: {include: {event: true}}},
    });

    if (!booking || !booking.timeSlot || !booking.timeSlot.event) {
      throw new Error("Booking data not found");
    }

    // Create Stripe checkout session
    const session = await stripe.checkout.sessions.create({
      ui_mode: "embedded",
      line_items: [
        {
          price_data: {
            currency: "sgd",
            product_data: {
              name: `${booking.timeSlot.event.type === "CASE_FILE" ? "Case File" : "Escape Room"} Registration`,
              description: `Booking for ${booking.timeSlot.startTime ? new Date(booking.timeSlot.startTime).toLocaleString() : "unknown time"} timeslot`,
            },
            unit_amount: Math.round(amount * 100), // Convert to cents
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      return_url: `${process.env.NEXT_PUBLIC_BASE_URL}/register/payment/status?session_id={CHECKOUT_SESSION_ID}`,
      customer_email: booking.buyerEmail || undefined,
      expires_at: Math.floor(Date.now() / 1000) + 30 * 60, // 30 minutes from now
      payment_method_types: ["paynow"],
      metadata: {
        bookingId: bookingId,
        timeSlotId: booking.timeSlot.id,
      },
    });
    await prisma.booking.update({
      where: {id: bookingId},
      data: {stripeSessionId: session.id},
    });
    return {clientSecret: session.client_secret, sessionId: session.id};
  } catch (error) {
    console.error("Error creating checkout session:", error);
    throw new Error("Failed to create checkout session");
  }
}

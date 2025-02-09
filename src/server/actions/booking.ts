"use server";

import prisma from "@/lib/db";
import {EventType, BookingStatus} from "@prisma/client";
import Stripe from "stripe";
import {processStep} from "@/server/actions/generate-token";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {apiVersion: "2025-01-27.acacia"});

export async function getAvailableTimeSlots(eventType: EventType) {
  await processStep();
  console.log("Getting available time slots");

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
  timeSlotId: number;
  buyerName: string;
  buyerEmail: string;
  buyerTelegram: string;
  teamName: string;
  teamMembers: {name: string}[];
}) {
  await processStep();
  console.log("Creating booking");

  // Start transaction
  return await prisma.$transaction(async (tx) => {
    // Get time slot and event details
    const timeSlot = await tx.timeSlot.findUnique({
      where: {id: data.timeSlotId},
      include: {event: true},
    });

    if (!timeSlot || timeSlot.status !== "AVAILABLE") {
      throw new Error("Time slot is not available, please choose another time slot.");
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
        teamName: data.teamName,
        teamMembers: data.teamMembers.map((m) => m.name),
        totalAmount: price,
      },
    });

    // Update time slot status to pending
    await tx.timeSlot.update({
      where: {id: data.timeSlotId},
      data: {status: "PENDING"},
    });

    await tx.event.update({
      where: {id: timeSlot.event.id},
      data: {
        soldCount: {increment: 1}, // Prevents race conditions
      },
    });

    return {booking, price};
  });
}

export async function createCheckoutSession(bookingId: number, amount: number) {
  await processStep();
  console.log("Creating checkout session");

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
              description: `Booking for ${
                booking.timeSlot.startTime.toLocaleString("en-SG", {
                  timeZone: "Asia/Singapore",
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                  hour: "2-digit",
                  minute: "2-digit",
                  hour12: false,
                })
                  ? new Date(booking.timeSlot.startTime).toLocaleString("en-SG", {
                      timeZone: "Asia/Singapore",
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                      hour12: false,
                    })
                  : "unknown time"
              } timeslot`,
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

export async function getPaymentStatus(sessionId: string) {
  await processStep();
  console.log("Getting payment status");

  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId);
    return {status: session.status};
  } catch (error) {
    console.error("Error getting payment status:", error);
    throw new Error("Failed to get payment status");
  }
}

export async function validateTeamName(teamName: string, event: EventType) {
  const existingBooking = await prisma.booking.findFirst({
    where: {
      AND: [
        {
          teamName: {
            equals: teamName,
            mode: "insensitive", // Case-insensitive comparison
          },
        },
        {
          timeSlot: {
            event: {type: event},
          },
        },
        {
          paymentStatus: {
            not: "cancelled",
          },
        },
      ],
    },
    include: {
      timeSlot: true,
    },
  });

  return !existingBooking;
}

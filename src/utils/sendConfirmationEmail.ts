"use server";

import {Resend} from "resend";
import {EventConfirmationEmail} from "@/emails/eventConfirmationEmail";

const resend = new Resend(process.env.RESEND_API_KEY);

type SendEmailParams = {
  eventName: "ESCAPE_ROOM" | "CASE_FILE";
  bookingId: number;
  buyerName: string;
  buyerEmail: string;
  buyerTelegram: string;
  teamName: string;
  participants: {name: string}[];
  timeSlot: Date;
  price: number;
  isEarlyBird: boolean;
};

export async function sendConfirmationEmail({
  eventName,
  bookingId,
  buyerName,
  buyerEmail,
  buyerTelegram,
  teamName,
  participants,
  timeSlot,
  price,
  isEarlyBird,
}: SendEmailParams) {
  try {
    const data = await resend.emails.send({
      from: "confirmation@pintugtd.com",
      to: buyerEmail,
      subject: `Booking Confirmation - ${eventName.replace("_", " ")}`,
      react: EventConfirmationEmail({
        eventName,
        bookingId,
        buyerName,
        buyerEmail,
        buyerTelegram,
        teamName,
        participants,
        timeSlot,
        price,
        isEarlyBird,
      }),
    });

    return {success: true, data};
  } catch (error) {
    console.error("Failed to send email:", error);
    return {success: false, error};
  }
}

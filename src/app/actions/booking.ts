"use server";

import prisma from "@/lib/db";
import {EventType, BookingStatus} from "@prisma/client";

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

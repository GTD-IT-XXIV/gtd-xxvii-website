import {PrismaClient, EventType} from "@prisma/client";
import {setHours, setMinutes} from "date-fns";

const prisma = new PrismaClient();

async function main() {
  // Create events
  const escapeRoom = await prisma.event.create({
    data: {
      type: EventType.ESCAPE_ROOM,
      price: 45,
      earlyBirdPrice: 40,
      earlyBirdCount: 5,
    },
  });

  const caseFile = await prisma.event.create({
    data: {
      type: EventType.CASE_FILE,
      price: 50,
      earlyBirdPrice: 45,
      earlyBirdCount: 5,
    },
  });

  // Generate time slots for specific dates
  const events = [
    {event: escapeRoom, dates: ["2025-02-22", "2025-02-23"]},
    {event: caseFile, dates: ["2025-03-01", "2025-03-02"]},
  ];

  const timeSlots = [];

  for (const {event, dates} of events) {
    for (const dateStr of dates) {
      // Create slots from 10 AM to 8 PM, every 2 hours
      for (let hour = 10; hour <= 20; hour += 2) {
        // Create a date in Singapore time (UTC+8)
        const startTime = new Date(`${dateStr}T${hour.toString().padStart(2, "0")}:00:00+08:00`);

        timeSlots.push({
          eventId: event.id,
          startTime,
        });
      }
    }
  }

  await prisma.timeSlot.createMany({
    data: timeSlots,
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

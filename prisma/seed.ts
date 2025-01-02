import {PrismaClient, EventType} from "@prisma/client";
import {addDays, setHours, setMinutes} from "date-fns";

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

  // Generate time slots for the next 3 days
  const events = [escapeRoom, caseFile];
  const timeSlots = [];

  for (const event of events) {
    for (let day = 0; day < 3; day++) {
      // Create slots from 10 AM to 8 PM, every 2 hours
      for (let hour = 10; hour <= 20; hour += 2) {
        const startTime = setHours(setMinutes(addDays(new Date(), day), 0), hour);

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

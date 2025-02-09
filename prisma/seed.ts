import {PrismaClient, EventType} from "@prisma/client";
import {setHours, setMinutes} from "date-fns";

const prisma = new PrismaClient();

async function main() {
  // Check if we already have events in the database
  const existingEvents = await prisma.event.count();

  if (existingEvents > 0) {
    console.log("Database already contains events. Skipping seed.");
    return;
  }

  console.log("No existing events found. Starting seed process...");

  // Create events
  const escapeRoom = await prisma.event.create({
    data: {
      type: EventType.ESCAPE_ROOM,
      price: 45,
      earlyBirdPrice: 35,
      earlyBirdCount: 3,
    },
  });

  const caseFile = await prisma.event.create({
    data: {
      type: EventType.CASE_FILE,
      price: 45,
      earlyBirdPrice: 35,
      earlyBirdCount: 1,
    },
  });

  // Define specific time slots for each event
  const caseFileSlots = [
    "09:00",
    "10:45",
    "12:30",
    "14:15",
    "16:00",
    "17:45",
    "19:30",
    "21:15",
  ].map((time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const startTime = setMinutes(setHours(new Date("2025-03-01"), hours), minutes);
    return {
      eventId: caseFile.id,
      startTime,
    };
  });

  const escapeRoomSlots = [
    "10:00",
    "10:50",
    "11:40",
    "13:10",
    "14:00",
    "14:50",
    "15:40",
    "16:30",
    "17:20",
    "18:50",
    "19:40",
    "20:30",
    "21:20",
  ].map((time) => {
    const [hours, minutes] = time.split(":").map(Number);
    const startTime = setMinutes(setHours(new Date("2025-02-23"), hours), minutes);
    return {
      eventId: escapeRoom.id,
      startTime,
    };
  });

  // Combine all time slots
  const timeSlots = [...caseFileSlots, ...escapeRoomSlots];

  // Create time slots in database
  await prisma.timeSlot.createMany({
    data: timeSlots,
  });

  console.log(
    `Seeding completed successfully: Created 2 events and ${timeSlots.length} time slots`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

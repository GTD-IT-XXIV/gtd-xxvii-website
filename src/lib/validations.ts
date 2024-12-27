import * as z from "zod";

export const eventSelectionSchema = z.object({
  eventType: z.enum(["ESCAPE_ROOM", "CASE_FILE"]),
  bookingType: z.enum(["INDIVIDUAL", "BUNDLE"]),
});

export const participantSchema = z.object({
  name: z.string().min(2),
  email: z.string().email(),
});

export const bookingDetailsSchema = z.object({
  participants: z.array(participantSchema).min(1).max(5),
});

export const slotSelectionSchema = z.object({
  slotId: z.string(),
});

export const bookingSchema = z.object({
  eventType: z.enum(["ESCAPE_ROOM", "CASE_FILE"]),
  bookingType: z.enum(["INDIVIDUAL", "BUNDLE"]),
  participants: z.array(participantSchema).min(1),
  email: z.string().email(),
});

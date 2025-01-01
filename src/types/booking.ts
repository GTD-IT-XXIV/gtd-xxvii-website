export type EventType = "ESCAPE_ROOM" | "CASE_FILE";
export type BookingType = "INDIVIDUAL" | "BUNDLE";

export type Participant = {
  name: string;
  email: string;
};

export type Slot = {
  id: string;
  startTime: Date;
  endTime: Date;
  capacity: number;
  status: "AVAILABLE" | "PENDING" | "UNAVAILABLE";
};

export type BookingState = {
  eventType: EventType | null;
  bookingType: BookingType | null;
  participants: Participant[];
  selectedSlot: Slot | null;
  email: string | null;

  // Actions
  setEventType: (type: EventType) => void;
  setBookingType: (type: BookingType) => void;
  setParticipants: (participants: Participant[]) => void;
  setSelectedSlot: (slot: Slot) => void;
  setEmail: (email: string) => void;
  resetBooking: () => void;
};

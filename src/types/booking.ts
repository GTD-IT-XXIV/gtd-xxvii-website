import {EventType, Booking} from "@prisma/client";

export type TeamMember = {
  name: string;
};

export type BookingState = {
  selectedEvent: EventType | null;
  buyerName: string;
  buyerEmail: string;
  buyerTelegram: string;
  teamMembers: TeamMember[];
  selectedTimeSlotId: string | null;
  price: number;
  booking: Booking | null;
  setSelectedEvent: (event: EventType | null) => void;
  setBuyerDetails: (name: string, email: string, telegram: string) => void;
  setTeamMembers: (members: TeamMember[]) => void;
  setSelectedTimeSlot: (timeSlotId: string | null) => void;
  setPrice: (price: number) => void;
  setBooking: (booking: Booking | null) => void;
  resetStore: () => void;
};

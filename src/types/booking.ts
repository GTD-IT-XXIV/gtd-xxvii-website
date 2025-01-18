import {EventType, Booking} from "@prisma/client";

export type TeamMember = {
  name: string;
};

export type BookingState = {
  selectedEvent: EventType | null;
  buyerName: string;
  buyerEmail: string;
  buyerTelegram: string;
  teamName: string;
  teamMembers: TeamMember[];
  selectedTimeSlotId: number | null;
  price: number;
  booking: Booking | null;
  setSelectedEvent: (event: EventType | null) => void;
  setBuyerDetails: (name: string, email: string, telegram: string) => void;
  setTeamName: (name: string) => void;
  setTeamMembers: (members: TeamMember[]) => void;
  setSelectedTimeSlot: (timeSlotId: number | null) => void;
  setPrice: (price: number) => void;
  setBooking: (booking: Booking | null) => void;
  resetStore: () => void;
};

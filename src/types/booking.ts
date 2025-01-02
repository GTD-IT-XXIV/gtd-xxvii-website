import {EventType} from "@prisma/client";

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
  setSelectedEvent: (event: EventType | null) => void;
  setBuyerDetails: (name: string, email: string, telegram: string) => void;
  setTeamMembers: (members: TeamMember[]) => void;
  setSelectedTimeSlot: (timeSlotId: string | null) => void;
  resetStore: () => void;
};

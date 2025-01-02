import {create} from "zustand";
import {EventType} from "@prisma/client";

type TeamMember = {
  name: string;
};

type BookingState = {
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

const initialState = {
  selectedEvent: null,
  buyerName: "",
  buyerEmail: "",
  buyerTelegram: "",
  teamMembers: Array(4).fill({name: ""}),
  selectedTimeSlotId: null,
};

export const useBookingStore = create<BookingState>((set) => ({
  ...initialState,

  setSelectedEvent: (event) => set({selectedEvent: event}),

  setBuyerDetails: (name, email, telegram) =>
    set({buyerName: name, buyerEmail: email, buyerTelegram: telegram}),

  setTeamMembers: (members) => set({teamMembers: members}),

  setSelectedTimeSlot: (timeSlotId) => set({selectedTimeSlotId: timeSlotId}),

  resetStore: () => set(initialState),
}));

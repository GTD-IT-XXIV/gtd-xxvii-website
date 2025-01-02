import {create} from "zustand";
import {persist} from "zustand/middleware";
import {BookingState} from "@/types/booking";

const initialState = {
  selectedEvent: null,
  buyerName: "",
  buyerEmail: "",
  buyerTelegram: "",
  teamMembers: Array(4).fill({name: ""}),
  selectedTimeSlotId: null,
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      ...initialState,

      setSelectedEvent: (event) => set({selectedEvent: event}),

      setBuyerDetails: (name, email, telegram) =>
        set({buyerName: name, buyerEmail: email, buyerTelegram: telegram}),

      setTeamMembers: (members) => set({teamMembers: members}),

      setSelectedTimeSlot: (timeSlotId) => set({selectedTimeSlotId: timeSlotId}),

      resetStore: () => set(initialState),
    }),
    {
      name: "booking-storage",
    },
  ),
);

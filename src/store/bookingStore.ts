import {create} from "zustand";
import {persist} from "zustand/middleware";
import {BookingState} from "@/types/booking";

const initialState = {
  eventType: null,
  bookingType: null,
  participants: [],
  selectedSlot: null,
  email: null,
};

export const useBookingStore = create<BookingState>()(
  persist(
    (set) => ({
      ...initialState,

      setEventType: (type) => set({eventType: type}),
      setBookingType: (type) => set({bookingType: type}),
      setParticipants: (participants) => set({participants}),
      setSelectedSlot: (slot) => set({selectedSlot: slot}),
      setEmail: (email) => set({email}),
      resetBooking: () => set(initialState),
    }),
    {
      name: "booking-storage",
    },
  ),
);

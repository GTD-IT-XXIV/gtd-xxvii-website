"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import {useBookingStore} from "@/store/bookingStore";
import {EventType, BookingType} from "@/types/booking";
import {routes} from "@/lib/navigation";
import EventCard from "./EventCard";
import {BookingTypeCard} from "./BookingTypeCard";

export function RegisterForm() {
  const router = useRouter();
  const {setEventType, setBookingType} = useBookingStore();
  const [selectedEvent, setSelectedEvent] = useState<EventType | null>(null);
  const [selectedType, setSelectedType] = useState<BookingType | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEvent || !selectedType) return;

    setEventType(selectedEvent);
    setBookingType(selectedType);
    router.push(routes.bookingDetails);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div>
        <label className="text-lg font-medium text-gray-900">Select Event</label>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <EventCard
            title="Escape Room"
            description="Challenge yourself in our escape room experience"
            price="$15 per person"
            selected={selectedEvent === "ESCAPE_ROOM"}
            onClick={() => setSelectedEvent("ESCAPE_ROOM")}
          />
          <EventCard
            title="Case File"
            description="Solve an intriguing mystery with our case file challenge"
            price="$10 per person"
            selected={selectedEvent === "CASE_FILE"}
            onClick={() => setSelectedEvent("CASE_FILE")}
          />
        </div>
      </div>

      <div>
        <label className="text-lg font-medium text-gray-900">Select Booking Type</label>
        <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
          <BookingTypeCard
            title="Individual"
            description="Book for yourself"
            selected={selectedType === "INDIVIDUAL"}
            onClick={() => setSelectedType("INDIVIDUAL")}
          />
          <BookingTypeCard
            title="Bundle (5 People)"
            description="Book for a group"
            selected={selectedType === "BUNDLE"}
            onClick={() => setSelectedType("BUNDLE")}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={!selectedEvent || !selectedType}
        className="w-full py-3 px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md disabled:opacity-50"
      >
        Continue to Details
      </button>
    </form>
  );
}

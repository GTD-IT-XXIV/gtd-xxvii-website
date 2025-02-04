"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useBookingStore} from "@/store/useBookingStore";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {getAvailableTimeSlots} from "@/app/actions/booking";
import type {TimeSlot} from "@prisma/client";
import {LoadingSpinner} from "@/app/_components/LoadingSpinner";

export default function BookingSlotPage() {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const {selectedEvent, selectedTimeSlotId, setSelectedTimeSlot, setStartTime} = useBookingStore(); // selectedEvent = ESCAPE_ROOM | CASE_FILE
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<number | null>(selectedTimeSlotId);
  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;

    if (!selectedEvent) {
      router.push("/register");
      return;
    }

    const fetchTimeSlots = async () => {
      try {
        const slots = await getAvailableTimeSlots(selectedEvent);
        setTimeSlots(slots);
      } catch (error) {
        console.error("Error fetching time slots:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTimeSlots();
  }, [isHydrated, selectedEvent, router]);

  // Sync selected slot with store, it will always reflect the latest selected slot
  useEffect(() => {
    if (isHydrated && selectedTimeSlotId) {
      setSelectedSlot(selectedTimeSlotId);
    }
  }, [isHydrated, selectedTimeSlotId]);

  const handleTimeSlotSelection = (slotId: number) => {
    setSelectedSlot(slotId);
    setSelectedTimeSlot(slotId);
    const selectedSlot = timeSlots.find((slot) => slot.id === slotId);
    if (selectedSlot) {
      setStartTime(new Date(selectedSlot.startTime).toLocaleString());
    }
  };

  const handleNext = () => {
    if (selectedSlot && selectedTimeSlotId) {
      router.push("/register/summary");
    }
  };

  if (!isHydrated || loading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container px-4 mx-auto py-8">
      <div className="text-3xl text-center text-white font-bold mt-5">Select Timeslot</div>
      <div className="text-sm text-center font-semibold text-white mb-10">
        Date: {selectedEvent === "CASE_FILE" ? "23 February 2025" : "1 March 2025"}
      </div>
      <Card className="max-w-2xl mx-auto p-2 shadow-md">
        <CardHeader>
          <CardTitle className="text-xl text-[#FF0089]">Choose Your Timeslot:</CardTitle>
        </CardHeader>
        <CardContent>
          {timeSlots.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No available time slots found.</p>
          ) : (
            <div className="grid grid-cols-2 gap-4">
              {timeSlots.map((slot) => (
                <button
                  key={slot.id}
                  className={`px-4 py-2 border border-[#64748B] rounded-xl cursor-pointer transition-colors text-center ${
                    selectedSlot === slot.id
                      ? "border-primary bg-primary/10"
                      : "hover:bg-primary/10"
                  }`}
                  onClick={() => handleTimeSlotSelection(slot.id)}
                >
                  <p className="font-normal text-[#64748B]">{`${new Date(slot.startTime).getHours().toString().padStart(2, "0")}:${new Date(slot.startTime).getMinutes().toString().padStart(2, "0")}`}</p>
                </button>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
      <div className="flex justify-end space-x-4 mt-6">
        <Button
          onClick={() => router.back()}
          className="bg-[#373737] py-2 text-white hover:bg-slate-600"
        >
          Back
        </Button>
        <Button
          onClick={handleNext}
          disabled={!selectedSlot}
          className="bg-[#FF0089] py-2 text-white hover:bg-pink-400"
        >
          Next
        </Button>
      </div>
    </div>
  );
}

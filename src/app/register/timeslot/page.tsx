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
  const {selectedEvent, selectedTimeSlotId, setSelectedTimeSlot, setStartTime} = useBookingStore();
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
      setStartTime(
        new Date(selectedSlot.startTime).toLocaleString("en-SG", {
          timeZone: "Asia/Singapore",
          year: "numeric",
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
          hour12: false,
        }),
      );
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
    <div className="container px-4 mx-auto py-8 font-inter">
      <div className="w-11/12 md:w-5/6 mx-auto">
        <Card className="max-w-7xl mx-auto px-2 pb-3 border-transparent shadow-[-3px_4px_10px_0px_#94A3B8]">
          <CardHeader>
            <CardTitle className="">
              <p className="font-bold text-2xl font-headline text-center">Select Timeslot</p>
              <p className="text-center text-gtd-primary text-sm">
                {selectedEvent === "CASE_FILE" ? "1 March 2025" : "23 February 2025"}
              </p>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {timeSlots.length === 0 ? (
              <p className="text-center text-gtd-primary py-8">No available time slots found.</p>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.id}
                    className={`px-4 py-2 border border-[#64748B] rounded-xl cursor-pointer transition-colors text-center ${
                      selectedSlot === slot.id
                        ? "border-primary bg-primary/15"
                        : "hover:bg-primary/10"
                    }`}
                    onClick={() => handleTimeSlotSelection(slot.id)}
                  >
                    <p className="font-normal text-gtd-primary">{`${new Date(slot.startTime).getHours().toString().padStart(2, "0")}:${new Date(slot.startTime).getMinutes().toString().padStart(2, "0")}`}</p>
                  </button>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-end space-x-4 mt-8">
          <Button
            onClick={() => router.push("/register/details")}
            className="h-6 px-6 py-4 rounded-lg bg-gtd-primary hover:opacity-80 hover:bg-gtd-primary hover:text-white text-white"
          >
            Back
          </Button>
          <Button
            onClick={handleNext}
            disabled={!selectedSlot}
            className="h-6 px-6 py-4 rounded-lg bg-gtd-secondary hover:opacity-80 hover:bg-gtd-secondary"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

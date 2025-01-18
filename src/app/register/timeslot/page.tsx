"use client";

import {useEffect, useState} from "react";
import {useRouter} from "next/navigation";
import {useBookingStore} from "@/store/useBookingStore";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {getAvailableTimeSlots} from "@/app/actions/booking";
import type {TimeSlot} from "@prisma/client";

export default function BookingSlotPage() {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const {selectedEvent, selectedTimeSlotId, setSelectedTimeSlot} = useBookingStore();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(selectedTimeSlotId);
  const [selectedDay, setSelectedDay] = useState<string>("All");
  const days = [
    "All",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
    "Sunday",
  ];

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

  const handleTimeSlotSelection = (slotId: string) => {
    setSelectedSlot(slotId);
    setSelectedTimeSlot(slotId);
  };

  const handleNext = () => {
    if (selectedSlot && selectedTimeSlotId) {
      router.push("/register/summary");
    }
  };

  const filterTimeSlots = (slots: TimeSlot[]) => {
    if (selectedDay === "All") return slots;

    return slots.filter((slot) => {
      const date = new Date(slot.startTime);
      const day = new Intl.DateTimeFormat("en-US", {weekday: "long"}).format(date);
      return day === selectedDay;
    });
  };

  if (!isHydrated || loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const filteredTimeSlots = filterTimeSlots(timeSlots);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="mb-2">Select Time Slot</CardTitle>
          <div className="relative w-full">
            <div className="overflow-x-auto scrollbar-thin scrollbar-track-transparent scrollbar-thumb-transparent">
              <div className="flex gap-2">
                {days.map((day) => (
                  <Button
                    key={day}
                    variant={selectedDay === day ? "default" : "outline"}
                    size="sm"
                    onClick={() => setSelectedDay(day)}
                    className="min-w-[80px]"
                  >
                    {day}
                  </Button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredTimeSlots.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No available time slots found.</p>
          ) : (
            <div className="grid gap-4">
              {filteredTimeSlots.map((slot) => (
                <div
                  key={slot.id}
                  className={`p-4 border rounded cursor-pointer transition-colors ${
                    selectedSlot === slot.id
                      ? "border-primary bg-primary/5"
                      : "hover:border-gray-300"
                  }`}
                  onClick={() => handleTimeSlotSelection(slot.id)}
                >
                  <p className="font-medium">{new Date(slot.startTime).toLocaleString()}</p>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end space-x-4 mt-6">
            <Button variant="outline" onClick={() => router.back()}>
              Back
            </Button>
            <Button onClick={handleNext} disabled={!selectedSlot}>
              Next
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

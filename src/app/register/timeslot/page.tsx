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
  const {selectedEvent, setSelectedTimeSlot} = useBookingStore();
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  useEffect(() => {
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
  }, [selectedEvent, router]);

  const handleTimeSlotSelection = (slotId: string) => {
    setSelectedSlot(slotId);
    setSelectedTimeSlot(slotId);
  };

  const handleNext = () => {
    if (selectedSlot) {
      router.push("/register/summary");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Select Time Slot</CardTitle>
        </CardHeader>
        <CardContent>
          {timeSlots.length === 0 ? (
            <p className="text-center text-gray-500 py-8">No available time slots found.</p>
          ) : (
            <div className="grid gap-4">
              {timeSlots.map((slot) => (
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

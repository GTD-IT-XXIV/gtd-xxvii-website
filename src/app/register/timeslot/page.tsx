"use client";

import {useQuery} from "@tanstack/react-query";
import {useRouter} from "next/navigation";
import {useBookingStore} from "@/store/useBookingStore";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {getAvailableTimeSlots} from "@/app/actions/booking";
import type {TimeSlot} from "@prisma/client";
import {LoadingSpinner} from "@/app/_components/LoadingSpinner";

export default function BookingSlotPage() {
  const router = useRouter();
  const {selectedEvent, selectedTimeSlotId, setSelectedTimeSlot, setStartTime} = useBookingStore();

  // Use React Query for data fetching
  const {data: timeSlots = [], isLoading} = useQuery({
    queryKey: ["timeSlots", selectedEvent],
    queryFn: () => getAvailableTimeSlots(selectedEvent!),
    enabled: !!selectedEvent,
    staleTime: 0,
    refetchOnWindowFocus: true,
    refetchInterval: 1000 * 60,
  });

  // Redirect if no event is selected
  if (typeof window !== "undefined" && !selectedEvent) {
    router.push("/register");
    return null;
  }

  const formatTime = (date: Date) => {
    return new Date(date).toLocaleTimeString("en-SG", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
      timeZone: "Asia/Singapore",
    });
  };

  const formatStartTime = (date: Date) => {
    return new Date(date).toLocaleString("en-SG", {
      timeZone: "Asia/Singapore",
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  const handleTimeSlotSelection = (slot: TimeSlot) => {
    setSelectedTimeSlot(slot.id);
    setStartTime(formatStartTime(slot.startTime));
  };

  const handleNext = () => {
    if (selectedTimeSlotId) {
      router.push("/register/summary");
    }
  };

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container px-4 mx-auto py-8 font-inter">
      <div className="w-11/12 md:w-5/6 mx-auto">
        <Card className="max-w-7xl mx-auto px-2 pb-3 border-transparent shadow-[-3px_4px_10px_0px_#94A3B8]">
          <CardHeader>
            <CardTitle>
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
                    onClick={() => handleTimeSlotSelection(slot)}
                    className={`
                      px-4 py-2 border border-[#64748B] rounded-xl 
                      cursor-pointer transition-colors text-center
                      ${
                        selectedTimeSlotId === slot.id
                          ? "border-primary bg-primary/15"
                          : "hover:bg-primary/10"
                      }
                    `}
                  >
                    <p className="font-normal text-gtd-primary">{formatTime(slot.startTime)}</p>
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
            disabled={!selectedTimeSlotId}
            className="h-6 px-6 py-4 rounded-lg bg-gtd-secondary hover:opacity-80 hover:bg-gtd-secondary"
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

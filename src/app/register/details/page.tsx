"use client";

import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useBookingStore} from "@/store/useBookingStore";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";
import {useEffect, useState} from "react";
import {validateTeamName} from "@/app/actions/booking";
import {EventType} from "@prisma/client";
import {LoadingSpinner} from "@/app/_components/LoadingSpinner";

const createTeamNameSchema = (event: EventType) =>
  z
    .string()
    .min(1, "Team name is required")
    .refine(
      async (name) => validateTeamName(name, event),
      "This team name is already taken for this event",
    );

export default function BookingDetailsPage() {
  const router = useRouter();
  const [isHydrated, setIsHydrated] = useState(false);
  const [isValidating, setIsValidating] = useState(false);

  const {
    selectedEvent,
    buyerName,
    buyerEmail,
    buyerTelegram,
    teamMembers,
    teamName,
    setBuyerDetails,
    setTeamMembers,
    setTeamName,
  } = useBookingStore();

  const bookingSchema = z.object({
    buyerName: z.string().min(1, "Leader's name is required"),
    buyerEmail: z.string().email("Invalid email address"),
    buyerTelegram: z.string().min(1, "Telegram handle is required"),
    teamName: selectedEvent ? createTeamNameSchema(selectedEvent) : z.string(),
    teamMembers: z
      .array(
        z.object({
          name: z.string().min(1, "Team member name is required"),
        }),
      )
      .length(4, "Exactly 4 team members are required"),
  });

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (isHydrated && !selectedEvent) {
      router.push("/register");
      return;
    }
  }, [isHydrated, selectedEvent, router]);

  const {
    register,
    handleSubmit,
    reset,
    formState: {errors, isSubmitting},
    trigger,
  } = useForm<z.infer<typeof bookingSchema>>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      buyerName: buyerName || "",
      buyerEmail: buyerEmail || "",
      buyerTelegram: buyerTelegram || "",
      teamName: teamName || "",
      teamMembers: teamMembers.length
        ? teamMembers.map((member) => ({name: member.name}))
        : Array(4).fill({name: ""}),
    },
  });

  useEffect(() => {
    if (isHydrated) {
      reset({
        buyerName: buyerName || "",
        buyerEmail: buyerEmail || "",
        buyerTelegram: buyerTelegram || "",
        teamName: teamName || "",
        teamMembers: teamMembers.length
          ? teamMembers.map((member) => ({name: member.name}))
          : Array(4).fill({name: ""}),
      });
    }
  }, [isHydrated, buyerName, buyerEmail, buyerTelegram, teamName, teamMembers, reset]);

  const onSubmit = async (data: z.infer<typeof bookingSchema>) => {
    if (!selectedEvent) {
      router.push("/register");
      return;
    }

    setIsValidating(true);
    try {
      // Final validation check with event ID
      const isValid = await validateTeamName(data.teamName, selectedEvent);
      if (!isValid) {
        setIsValidating(false);
        return;
      }

      setBuyerDetails(data.buyerName, data.buyerEmail, data.buyerTelegram);
      setTeamName(data.teamName);
      setTeamMembers(data.teamMembers);
      router.push("/register/timeslot");
    } finally {
      setIsValidating(false);
    }
  };

  // Add debounced team name validation
  const handleTeamNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value && selectedEvent) {
      await trigger("teamName");
    }
  };

  if (!isHydrated) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 pb-8 pt-1 font-inter">
      <div className="w-11/12 md:w-5/6 mx-auto">
        <Card className="max-w-7xl mx-auto mt-8 border-transparent shadow-[-3px_4px_10px_0px_#94A3B8]">
          <CardHeader>
            <CardTitle className="">
              <p className="font-bold text-2xl font-headline text-center">Booking Details</p>
              <p className="text-center text-gtd-primary text-sm">Fill in the details below</p>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit(onSubmit)} className="md:flex md:justify-left">
              <div className="md:w-1/2 space-y-4 mb-4 md:px-8">
                <div>
                  <label className="block text-xs font-medium mb-1">Leader Name</label>
                  <input
                    {...register("buyerName")}
                    className="w-full p-2 border rounded border-transparent bg-[#EBEBEB] text-xs"
                    placeholder="Type Here"
                  />
                  {errors.buyerName && (
                    <p className="text-red-500 text-sm mt-1">{errors.buyerName.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Leader Email Address</label>
                  <input
                    {...register("buyerEmail")}
                    type="email"
                    className="w-full p-2 border rounded border-transparent bg-[#EBEBEB] text-xs"
                    placeholder="Type Here"
                  />
                  {errors.buyerEmail && (
                    <p className="text-red-500 text-sm mt-1">{errors.buyerEmail.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Leader Telegram Handle</label>
                  <input
                    {...register("buyerTelegram")}
                    className="w-full p-2 border rounded border-transparent bg-[#EBEBEB] text-xs"
                    placeholder="Type Here"
                  />
                  {errors.buyerTelegram && (
                    <p className="text-red-500 text-sm mt-1">{errors.buyerTelegram.message}</p>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-medium mb-1">Team Name</label>
                  <input
                    {...register("teamName")}
                    className="w-full p-2 border rounded border-transparent bg-[#EBEBEB] text-xs"
                    placeholder="Type Here"
                    onChange={(e) => {
                      register("teamName").onChange(e);
                      handleTeamNameChange(e);
                    }}
                  />
                  {errors.teamName && (
                    <p className="text-red-500 text-sm mt-1">{errors.teamName.message}</p>
                  )}
                </div>
              </div>

              <div className="md:w-1/2 space-y-4 md:px-8">
                <div className="space-y-4">
                  {[0, 1, 2, 3].map((index) => (
                    <div key={index}>
                      <label className="block text-xs font-medium mb-1">
                        Team Member {index + 1}
                      </label>
                      <input
                        {...register(`teamMembers.${index}.name`)}
                        className="w-full p-2 border rounded border-transparent bg-[#EBEBEB] text-xs"
                        placeholder="Type Here"
                      />
                      {errors.teamMembers?.[index]?.name && (
                        <p className="text-red-500 text-sm mt-1">
                          {errors.teamMembers[index]?.name?.message}
                        </p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
        <div className="flex justify-end space-x-4 mt-8">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.push("/register")}
            className="h-6 px-6 py-4 rounded-lg bg-gtd-primary hover:opacity-80 hover:bg-gtd-primary hover:text-white text-white"
          >
            Back
          </Button>
          <Button
            type="submit"
            disabled={isSubmitting || isValidating}
            onClick={handleSubmit(onSubmit)}
            className="h-6 px-6 py-4 rounded-lg bg-gtd-secondary hover:opacity-80 hover:bg-gtd-secondary"
          >
            {isSubmitting || isValidating ? "Validating..." : "Next"}
          </Button>
        </div>
      </div>
    </div>
  );
}

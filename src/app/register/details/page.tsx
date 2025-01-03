"use client";

import {useRouter} from "next/navigation";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {useBookingStore} from "@/store/useBookingStore";
import {Button} from "@/components/ui/button";
import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card";

const bookingSchema = z.object({
  buyerName: z.string().min(1, "Leader's name is required"),
  buyerEmail: z.string().email("Invalid email address"),
  buyerTelegram: z.string().min(1, "Telegram handle is required"),
  teamMembers: z
    .array(
      z.object({
        name: z.string().min(1, "Team member name is required"),
      }),
    )
    .length(4, "Exactly 4 team members are required"),
});

type BookingFormData = z.infer<typeof bookingSchema>;

export default function BookingDetailsPage() {
  const router = useRouter();
  const {setBuyerDetails, setTeamMembers} = useBookingStore();

  const {
    register,
    handleSubmit,
    formState: {errors},
  } = useForm<BookingFormData>({
    resolver: zodResolver(bookingSchema),
    defaultValues: {
      teamMembers: Array(4).fill({name: ""}),
    },
  });

  const onSubmit = (data: BookingFormData) => {
    setBuyerDetails(data.buyerName, data.buyerEmail, data.buyerTelegram);
    setTeamMembers(data.teamMembers);
    router.push("/register/timeslot");
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Booking Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Leader Name</label>
                <input {...register("buyerName")} className="w-full p-2 border rounded" />
                {errors.buyerName && (
                  <p className="text-red-500 text-sm mt-1">{errors.buyerName.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Leader Email Address</label>
                <input
                  {...register("buyerEmail")}
                  type="email"
                  className="w-full p-2 border rounded"
                />
                {errors.buyerEmail && (
                  <p className="text-red-500 text-sm mt-1">{errors.buyerEmail.message}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Leader Telegram Handle</label>
                <input {...register("buyerTelegram")} className="w-full p-2 border rounded" />
                {errors.buyerTelegram && (
                  <p className="text-red-500 text-sm mt-1">{errors.buyerTelegram.message}</p>
                )}
              </div>

              <div className="space-y-4">
                <h3 className="font-medium">Team Members</h3>
                {[0, 1, 2, 3].map((index) => (
                  <div key={index}>
                    <label className="block text-sm font-medium mb-1">
                      Team Member {index + 1}
                    </label>
                    <input
                      {...register(`teamMembers.${index}.name`)}
                      className="w-full p-2 border rounded"
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

            <div className="flex justify-end space-x-4">
              <Button type="button" variant="outline" onClick={() => router.back()}>
                Back
              </Button>
              <Button type="submit">Next</Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

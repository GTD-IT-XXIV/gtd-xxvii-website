"use client";
import {useForm, useFieldArray} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {useRouter} from "next/navigation";
import {useBookingStore} from "@/store/useBookingStore";
import {participantSchema} from "@/lib/validations";
import {routes} from "@/lib/navigation";
import {z} from "zod";

const formSchema = z.object({
  email: z.string().email(),
  participants: z.array(participantSchema),
});

type FormData = z.infer<typeof formSchema>;

export function BookingDetailsForm() {
  const router = useRouter();
  const {bookingType, setParticipants, setEmail} = useBookingStore();

  const participantsCount = bookingType === "BUNDLE" ? 5 : 1;

  const {
    register,
    control,
    handleSubmit,
    formState: {errors},
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      participants: Array(participantsCount).fill({name: "", contact: ""}),
    },
  });

  const {fields} = useFieldArray({
    control,
    name: "participants",
  });

  const onSubmit = (data: FormData) => {
    setEmail(data.email);
    setParticipants(data.participants);
    router.push(routes.bookingSlot);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">Buyer Email Address</label>
        <input
          type="email"
          {...register("email")}
          className="mt-1 block px-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
        {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email.message}</p>}
      </div>

      {fields.map((field, index) => (
        <div key={field.id} className="space-y-4 p-4 border rounded-md">
          <h3 className="font-medium">
            {bookingType === "BUNDLE" ? `Participant ${index + 1}` : "Your Details"}
          </h3>

          <div>
            <label className="block text-sm font-medium text-gray-700">Name</label>
            <input
              type="text"
              {...register(`participants.${index}.name`)}
              className="mt-1 px-2 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.participants?.[index]?.name && (
              <p className="mt-1 text-sm text-red-600">
                {errors.participants[index]?.name?.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <input
              type="text"
              {...register(`participants.${index}.email`)}
              className="mt-1 block px-2 w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            />
            {errors.participants?.[index]?.email && (
              <p className="mt-1 text-sm text-red-600">
                {errors.participants[index]?.email?.message}
              </p>
            )}
          </div>
        </div>
      ))}

      <button
        type="submit"
        className="w-full py-3 px-4 text-white bg-indigo-600 hover:bg-indigo-700 rounded-md"
      >
        Continue to Slot Selection
      </button>
    </form>
  );
}

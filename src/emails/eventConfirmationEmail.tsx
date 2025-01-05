import {Html, Head, Body, Container, Section, Text, Hr} from "@react-email/components";
import {format} from "date-fns";
import {Tailwind} from "@react-email/tailwind";

type Participant = {
  name: string;
};

type EventConfirmationEmailProps = {
  eventName: "ESCAPE_ROOM" | "CASE_FILE";
  bookingId: string;
  buyerName: string;
  buyerEmail: string;
  buyerTelegram: string;
  participants: Participant[];
  timeSlot: Date;
  price: number;
  isEarlyBird: boolean;
};

export const EventConfirmationEmail = ({
  eventName,
  bookingId,
  buyerName,
  buyerEmail,
  buyerTelegram,
  participants,
  timeSlot,
  price,
  isEarlyBird,
}: EventConfirmationEmailProps) => {
  const eventDescriptions = {
    ESCAPE_ROOM:
      "Challenge yourself in our escape room experience! Work together with your team to solve puzzles and uncover mysteries.",
    CASE_FILE:
      "Put your detective skills to the test in our case file challenge. Analyze evidence, connect the dots, and solve the case with your team.",
  };

  return (
    <Html>
      <Tailwind>
        <Body className="bg-gray-100 py-5">
          <Container className="mx-auto">
            <Section className="bg-white p-10 rounded-lg shadow-md">
              <Text className="text-2xl font-bold text-center text-gray-800">
                Booking Confirmation
              </Text>

              <Text className="text-base text-gray-600 text-center">
                Thank you for booking {eventName.replace("_", " ")}!
              </Text>

              <Hr className="my-5 border-gray-200" />

              <Text className="text-base mb-2">
                <span className="font-semibold">Booking ID:</span> {bookingId}
              </Text>

              <Text className="text-base mb-5">{eventDescriptions[eventName]}</Text>

              <Section className="bg-gray-50 p-5 rounded-md">
                <Text className="text-lg font-semibold mb-3">Event Details</Text>
                <Text className="mb-2">
                  <span className="font-semibold">Date & Time:</span>{" "}
                  {format(timeSlot, "MMMM dd, yyyy HH:mm")}
                </Text>
                <Text className="mb-2">
                  <span className="font-semibold">Price:</span> ${price.toFixed(2)}{" "}
                  {isEarlyBird && (
                    <span className="text-green-600 ml-1">(Early Bird Discount Applied)</span>
                  )}
                </Text>
              </Section>

              <Section className="mt-5">
                <Text className="text-lg font-semibold mb-3">Team Information</Text>
                <div className="space-y-2">
                  <Text>
                    <span className="font-semibold">Team Leader:</span> {buyerName}
                  </Text>
                  <Text>
                    <span className="font-semibold">Email:</span> {buyerEmail}
                  </Text>
                  <Text>
                    <span className="font-semibold">Telegram:</span> {buyerTelegram}
                  </Text>
                </div>

                <Text className="mt-3 mb-2">
                  <span className="font-semibold">Team Members:</span>
                </Text>
                <div className="pl-5 space-y-1">
                  {participants.map((participant, index) => (
                    <Text key={index}>
                      {index + 1}. {participant.name}
                    </Text>
                  ))}
                </div>
              </Section>

              <Hr className="my-5 border-gray-200" />

              <Text className="text-sm text-gray-600 text-center">
                Please arrive 10 minutes before your scheduled time. If you need to make any
                changes, please contact us through Telegram.
              </Text>
            </Section>
          </Container>
        </Body>
      </Tailwind>
    </Html>
  );
};

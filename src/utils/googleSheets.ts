import {google} from "googleapis";
import {JWT} from "google-auth-library";
import {Booking, TimeSlot, Event, EventType} from "@prisma/client";

// Initialize Google Sheets client
const getGoogleSheetsClient = () => {
  const client = new JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL,
    key: process.env.GOOGLE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    scopes: ["https://www.googleapis.com/auth/spreadsheets"],
  });

  return google.sheets({version: "v4", auth: client});
};

// Add booking record to respective worksheet
export async function addBookingToSheet(booking: Booking, timeSlot: TimeSlot, event: Event) {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEETS_ID;

  const worksheetName = event.type === EventType.ESCAPE_ROOM ? "Escape Room" : "Case File";

  const values = [
    [
      booking.id,
      booking.timeSlotId,
      timeSlot.startTime,
      booking.teamName,
      booking.buyerName,
      booking.buyerEmail,
      booking.buyerTelegram,
      ...booking.teamMembers,
      "", // Placeholder for completion time
    ],
  ];

  try {
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${worksheetName}!A:J`,
      valueInputOption: "USER_ENTERED",
      requestBody: {values},
    });
  } catch (error) {
    console.error("Error adding booking to sheet:", error);
    throw new Error("Failed to record booking in spreadsheet");
  }
}

// Get leaderboard data
export async function getLeaderboardData(eventType: EventType) {
  const sheets = getGoogleSheetsClient();
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  const worksheetName =
    eventType === EventType.ESCAPE_ROOM ? "Escape Room Bookings" : "Case File Bookings";

  try {
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${worksheetName}!A:J`,
    });

    const rows = response.data.values || [];

    // Filter teams with completion times and sort by completion time
    return rows
      .slice(1) // Skip header row
      .filter((row) => row[11] !== "") // Only include teams with completion times
      .map((row) => ({
        teamName: row[3],
        completionTime: row[11],
        members: row.slice(7, 11),
      }))
      .sort((a, b) => parseFloat(a.completionTime) - parseFloat(b.completionTime));
  } catch (error) {
    console.error("Error fetching leaderboard data:", error);
    throw new Error("Failed to fetch leaderboard data");
  }
}

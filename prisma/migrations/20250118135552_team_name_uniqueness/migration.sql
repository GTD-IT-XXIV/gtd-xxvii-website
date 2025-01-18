/*
  Warnings:

  - A unique constraint covering the columns `[teamName]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Booking_teamName_key" ON "Booking"("teamName");

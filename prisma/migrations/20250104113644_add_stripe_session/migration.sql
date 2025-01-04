/*
  Warnings:

  - You are about to drop the column `paymentIntent` on the `Booking` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[stripeSessionId]` on the table `Booking` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Booking_paymentIntent_key";

-- AlterTable
ALTER TABLE "Booking" DROP COLUMN "paymentIntent",
ADD COLUMN     "stripeSessionId" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Booking_stripeSessionId_key" ON "Booking"("stripeSessionId");

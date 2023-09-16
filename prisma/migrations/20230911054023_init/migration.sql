/*
  Warnings:

  - You are about to drop the column `totalPaymentAmount` on the `student_semester_payments` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "student_semester_payments" DROP COLUMN "totalPaymentAmount",
ADD COLUMN     "totalPaidAmount" INTEGER DEFAULT 0;

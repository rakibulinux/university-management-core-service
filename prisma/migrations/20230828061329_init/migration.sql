/*
  Warnings:

  - You are about to drop the column `academicSemesterId` on the `offered_courses` table. All the data in the column will be lost.
  - Added the required column `academicDepartmentId` to the `offered_courses` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "offered_courses" DROP CONSTRAINT "offered_courses_academicSemesterId_fkey";

-- AlterTable
ALTER TABLE "offered_courses" DROP COLUMN "academicSemesterId",
ADD COLUMN     "academicDepartmentId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "offered_courses" ADD CONSTRAINT "offered_courses_academicDepartmentId_fkey" FOREIGN KEY ("academicDepartmentId") REFERENCES "academic_department"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

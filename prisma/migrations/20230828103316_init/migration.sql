/*
  Warnings:

  - You are about to drop the column `offeredCourse` on the `offered_course_sections` table. All the data in the column will be lost.
  - Added the required column `offeredCourseId` to the `offered_course_sections` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "offered_course_sections" DROP CONSTRAINT "offered_course_sections_offeredCourse_fkey";

-- AlterTable
ALTER TABLE "offered_course_sections" DROP COLUMN "offeredCourse",
ADD COLUMN     "offeredCourseId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "offered_course_sections" ADD CONSTRAINT "offered_course_sections_offeredCourseId_fkey" FOREIGN KEY ("offeredCourseId") REFERENCES "offered_courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

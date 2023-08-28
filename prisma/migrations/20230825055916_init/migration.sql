/*
  Warnings:

  - You are about to drop the `coursetoprerequisite` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "coursetoprerequisite" DROP CONSTRAINT "coursetoprerequisite_courseId_fkey";

-- DropForeignKey
ALTER TABLE "coursetoprerequisite" DROP CONSTRAINT "coursetoprerequisite_preRequisiteId_fkey";

-- DropTable
DROP TABLE "coursetoprerequisite";

-- CreateTable
CREATE TABLE "CourseToPrerequisite" (
    "courseId" TEXT NOT NULL,
    "preRequisiteId" TEXT NOT NULL,

    CONSTRAINT "CourseToPrerequisite_pkey" PRIMARY KEY ("courseId","preRequisiteId")
);

-- AddForeignKey
ALTER TABLE "CourseToPrerequisite" ADD CONSTRAINT "CourseToPrerequisite_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseToPrerequisite" ADD CONSTRAINT "CourseToPrerequisite_preRequisiteId_fkey" FOREIGN KEY ("preRequisiteId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

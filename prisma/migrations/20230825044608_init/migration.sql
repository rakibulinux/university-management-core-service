/*
  Warnings:

  - You are about to drop the `CourseToPrerequisite` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CourseToPrerequisite" DROP CONSTRAINT "CourseToPrerequisite_courseId_fkey";

-- DropForeignKey
ALTER TABLE "CourseToPrerequisite" DROP CONSTRAINT "CourseToPrerequisite_preRequisitsId_fkey";

-- DropTable
DROP TABLE "CourseToPrerequisite";

-- CreateTable
CREATE TABLE "coursetoprerequisite" (
    "courseId" TEXT NOT NULL,
    "preRequisitsId" TEXT NOT NULL,

    CONSTRAINT "coursetoprerequisite_pkey" PRIMARY KEY ("courseId","preRequisitsId")
);

-- AddForeignKey
ALTER TABLE "coursetoprerequisite" ADD CONSTRAINT "coursetoprerequisite_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "coursetoprerequisite" ADD CONSTRAINT "coursetoprerequisite_preRequisitsId_fkey" FOREIGN KEY ("preRequisitsId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

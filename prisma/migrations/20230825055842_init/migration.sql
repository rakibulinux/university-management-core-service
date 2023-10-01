/*
  Warnings:

  - The primary key for the `coursetoprerequisite` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `preRequisitsId` on the `coursetoprerequisite` table. All the data in the column will be lost.
  - Added the required column `preRequisiteId` to the `coursetoprerequisite` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "coursetoprerequisite" DROP CONSTRAINT "coursetoprerequisite_preRequisitsId_fkey";

-- AlterTable
ALTER TABLE "coursetoprerequisite" DROP CONSTRAINT "coursetoprerequisite_pkey",
DROP COLUMN "preRequisitsId",
ADD COLUMN     "preRequisiteId" TEXT NOT NULL,
ADD CONSTRAINT "coursetoprerequisite_pkey" PRIMARY KEY ("courseId", "preRequisiteId");

-- AddForeignKey
ALTER TABLE "coursetoprerequisite" ADD CONSTRAINT "coursetoprerequisite_preRequisiteId_fkey" FOREIGN KEY ("preRequisiteId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

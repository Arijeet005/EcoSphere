/*
  Warnings:

  - Added the required column `dueDate` to the `ComplianceIssue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `ownerId` to the `ComplianceIssue` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EmployeeParticipationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "ComplianceIssueStatus" AS ENUM ('OPEN', 'CLOSED');

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ChallengeStatus" ADD VALUE 'UNDER_REVIEW';
ALTER TYPE "ChallengeStatus" ADD VALUE 'COMPLETED';
ALTER TYPE "ChallengeStatus" ADD VALUE 'ARCHIVED';

-- AlterEnum
-- This migration adds more than one value to an enum.
-- With PostgreSQL versions 11 and earlier, this is not possible
-- in a single migration. This can be worked around by creating
-- multiple migrations, each migration adding only one value to
-- the enum.


ALTER TYPE "ParticipationStatus" ADD VALUE 'SUBMITTED';
ALTER TYPE "ParticipationStatus" ADD VALUE 'APPROVED';
ALTER TYPE "ParticipationStatus" ADD VALUE 'REJECTED';

-- AlterTable
ALTER TABLE "Badge" ADD COLUMN     "unlockRule" JSONB;

-- AlterTable
ALTER TABLE "CSRActivity" ADD COLUMN     "evidenceRequired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "pointsValue" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "Challenge" ADD COLUMN     "evidenceRequired" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "xpReward" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ChallengeParticipation" ADD COLUMN     "evidenceUrl" TEXT,
ADD COLUMN     "reviewedAt" TIMESTAMP(3),
ADD COLUMN     "reviewedById" INTEGER,
ADD COLUMN     "submissionNote" TEXT,
ADD COLUMN     "submittedAt" TIMESTAMP(3),
ADD COLUMN     "xpAwarded" INTEGER NOT NULL DEFAULT 0;

-- AlterTable
ALTER TABLE "ComplianceIssue" ADD COLUMN     "dueDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "ownerId" INTEGER NOT NULL,
ADD COLUMN     "status" "ComplianceIssueStatus" NOT NULL DEFAULT 'OPEN';

-- AlterTable
ALTER TABLE "EmployeeParticipation" ADD COLUMN     "proofUrl" TEXT,
ADD COLUMN     "status" "EmployeeParticipationStatus" NOT NULL DEFAULT 'PENDING';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "points" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "xp" INTEGER NOT NULL DEFAULT 0;

-- CreateIndex
CREATE INDEX "ComplianceIssue_ownerId_idx" ON "ComplianceIssue"("ownerId");

-- CreateIndex
CREATE INDEX "ComplianceIssue_status_idx" ON "ComplianceIssue"("status");

-- CreateIndex
CREATE INDEX "ComplianceIssue_dueDate_idx" ON "ComplianceIssue"("dueDate");

-- CreateIndex
CREATE INDEX "EmployeeParticipation_status_idx" ON "EmployeeParticipation"("status");

-- AddForeignKey
ALTER TABLE "ComplianceIssue" ADD CONSTRAINT "ComplianceIssue_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

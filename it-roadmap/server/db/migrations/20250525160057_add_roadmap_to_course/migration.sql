-- AlterTable
ALTER TABLE "Course" ADD COLUMN     "roadmapId" INTEGER;

-- CreateIndex
CREATE INDEX "Course_roadmapId_idx" ON "Course"("roadmapId");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "roadmaps"("roadmap_id") ON DELETE SET NULL ON UPDATE CASCADE;

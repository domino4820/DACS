/*
  Warnings:

  - You are about to drop the `courses` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `edges` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `nodes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_category_id_fkey";

-- DropForeignKey
ALTER TABLE "courses" DROP CONSTRAINT "courses_skill_id_fkey";

-- DropForeignKey
ALTER TABLE "documents" DROP CONSTRAINT "documents_course_id_fkey";

-- DropForeignKey
ALTER TABLE "edges" DROP CONSTRAINT "edges_roadmap_id_fkey";

-- DropForeignKey
ALTER TABLE "nodes" DROP CONSTRAINT "nodes_course_id_fkey";

-- DropForeignKey
ALTER TABLE "nodes" DROP CONSTRAINT "nodes_roadmap_id_fkey";

-- DropForeignKey
ALTER TABLE "user_progress" DROP CONSTRAINT "user_progress_course_id_fkey";

-- DropTable
DROP TABLE "courses";

-- DropTable
DROP TABLE "edges";

-- DropTable
DROP TABLE "nodes";

-- CreateTable
CREATE TABLE "Course" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "url" TEXT,
    "content" TEXT,
    "categoryId" INTEGER,
    "skillId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Node" (
    "id" SERIAL NOT NULL,
    "nodeIdentifier" TEXT NOT NULL,
    "positionX" DOUBLE PRECISION NOT NULL,
    "positionY" DOUBLE PRECISION NOT NULL,
    "data" TEXT,
    "roadmapId" INTEGER NOT NULL,
    "courseId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Node_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Edge" (
    "id" SERIAL NOT NULL,
    "edgeIdentifier" TEXT NOT NULL,
    "source" TEXT NOT NULL,
    "target" TEXT NOT NULL,
    "type" TEXT,
    "animated" BOOLEAN NOT NULL DEFAULT false,
    "style" TEXT,
    "roadmapId" INTEGER NOT NULL,
    "courseId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Edge_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Course_code_key" ON "Course"("code");

-- CreateIndex
CREATE INDEX "Course_categoryId_idx" ON "Course"("categoryId");

-- CreateIndex
CREATE INDEX "Course_skillId_idx" ON "Course"("skillId");

-- CreateIndex
CREATE UNIQUE INDEX "Node_nodeIdentifier_key" ON "Node"("nodeIdentifier");

-- CreateIndex
CREATE INDEX "Node_roadmapId_idx" ON "Node"("roadmapId");

-- CreateIndex
CREATE INDEX "Node_nodeIdentifier_idx" ON "Node"("nodeIdentifier");

-- CreateIndex
CREATE INDEX "Node_courseId_idx" ON "Node"("courseId");

-- CreateIndex
CREATE UNIQUE INDEX "Edge_edgeIdentifier_key" ON "Edge"("edgeIdentifier");

-- CreateIndex
CREATE INDEX "Edge_roadmapId_idx" ON "Edge"("roadmapId");

-- CreateIndex
CREATE INDEX "Edge_edgeIdentifier_idx" ON "Edge"("edgeIdentifier");

-- CreateIndex
CREATE INDEX "Edge_courseId_idx" ON "Edge"("courseId");

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("category_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Course" ADD CONSTRAINT "Course_skillId_fkey" FOREIGN KEY ("skillId") REFERENCES "skills"("skill_id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "roadmaps"("roadmap_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Node" ADD CONSTRAINT "Node_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_roadmapId_fkey" FOREIGN KEY ("roadmapId") REFERENCES "roadmaps"("roadmap_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Edge" ADD CONSTRAINT "Edge_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "user_progress" ADD CONSTRAINT "user_progress_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "documents" ADD CONSTRAINT "documents_course_id_fkey" FOREIGN KEY ("course_id") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

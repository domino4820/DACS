-- CreateTable
CREATE TABLE "roadmap_skills" (
    "roadmap_id" INTEGER NOT NULL,
    "skill_id" INTEGER NOT NULL,

    CONSTRAINT "roadmap_skills_pkey" PRIMARY KEY ("roadmap_id","skill_id")
);

-- AddForeignKey
ALTER TABLE "roadmap_skills" ADD CONSTRAINT "roadmap_skills_roadmap_id_fkey" FOREIGN KEY ("roadmap_id") REFERENCES "roadmaps"("roadmap_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "roadmap_skills" ADD CONSTRAINT "roadmap_skills_skill_id_fkey" FOREIGN KEY ("skill_id") REFERENCES "skills"("skill_id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateEnum
CREATE TYPE "user_role" AS ENUM ('ADMIN', 'AGENT');

-- CreateEnum
CREATE TYPE "plant_status" AS ENUM ('PLANTED', 'GROWING', 'READY', 'HARVESTED');

-- CreateTable
CREATE TABLE "user" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "role" "user_role" NOT NULL DEFAULT 'AGENT',
    "name" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "user_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "field" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "crop_type" TEXT NOT NULL,
    "current_stage" "plant_status" NOT NULL DEFAULT 'PLANTED',
    "planting_date" TIMESTAMP(3) NOT NULL,
    "notes" TEXT[],
    "assigned_agent_id" TEXT,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "field_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "user_email_key" ON "user"("email");

-- AddForeignKey
ALTER TABLE "field" ADD CONSTRAINT "field_assigned_agent_id_fkey" FOREIGN KEY ("assigned_agent_id") REFERENCES "user"("id") ON DELETE SET NULL ON UPDATE CASCADE;

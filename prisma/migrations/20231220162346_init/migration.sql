-- CreateTable
CREATE TABLE "governors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nickname" TEXT NOT NULL,
    "power" TEXT NOT NULL,
    "kill_points" TEXT NOT NULL,
    "tier_1_kills" TEXT NOT NULL,
    "tier_2_kills" TEXT NOT NULL,
    "tier_3_kills" TEXT NOT NULL,
    "tier_4_kills" TEXT NOT NULL,
    "tier_5_kills" TEXT NOT NULL,
    "dead" TEXT NOT NULL,
    "resource_assistance" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "governor_connections" (
    "discord_user_id" TEXT NOT NULL,
    "governor_id" TEXT NOT NULL,
    "governor_type" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "governor_connections_governor_id_fkey" FOREIGN KEY ("governor_id") REFERENCES "governors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "title_buff_configurations" (
    "title" TEXT NOT NULL PRIMARY KEY,
    "locked" BOOLEAN NOT NULL,
    "ttl" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "title_buff_requests" (
    "discord_user_id" TEXT NOT NULL PRIMARY KEY,
    "kingdom_type" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "governor_connections_discord_user_id_governor_type_key" ON "governor_connections"("discord_user_id", "governor_type");

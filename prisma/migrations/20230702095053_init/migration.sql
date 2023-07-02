-- CreateTable
CREATE TABLE "title_configurations" (
    "title" TEXT NOT NULL PRIMARY KEY,
    "locked" BOOLEAN NOT NULL,
    "ttl" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "title_requests" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "discord_user_id" BIGINT NOT NULL,
    "kingdom_id" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "governors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nickname" TEXT NOT NULL,
    "power" TEXT NOT NULL,
    "kp" TEXT NOT NULL,
    "tier1kp" TEXT NOT NULL,
    "tier2kp" TEXT NOT NULL,
    "tier3kp" TEXT NOT NULL,
    "tier4kp" TEXT NOT NULL,
    "tier5kp" TEXT NOT NULL,
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

    PRIMARY KEY ("discord_user_id", "governor_type"),
    CONSTRAINT "governor_connections_governor_id_fkey" FOREIGN KEY ("governor_id") REFERENCES "governors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "governor_dkps" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "power_difference" TEXT NOT NULL,
    "tier4kp_difference" TEXT NOT NULL,
    "tier5kp_difference" TEXT NOT NULL,
    "dead_difference" TEXT NOT NULL,
    "governor_id" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "governor_dkps_governor_id_fkey" FOREIGN KEY ("governor_id") REFERENCES "governors" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "governor_dkps_governor_id_key" ON "governor_dkps"("governor_id");

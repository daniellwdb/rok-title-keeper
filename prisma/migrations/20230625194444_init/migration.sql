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

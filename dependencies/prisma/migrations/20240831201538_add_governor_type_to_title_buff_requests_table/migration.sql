/*
  Warnings:

  - The primary key for the `title_buff_requests` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `governor_type` to the `title_buff_requests` table without a default value. This is not possible if the table is not empty.

*/
-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_title_buff_requests" (
    "discord_user_id" TEXT NOT NULL,
    "kingdom_type" TEXT NOT NULL,
    "governor_type" TEXT NOT NULL,
    "x" INTEGER NOT NULL,
    "y" INTEGER NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_title_buff_requests" ("created_at", "discord_user_id", "kingdom_type", "updated_at", "x", "y") SELECT "created_at", "discord_user_id", "kingdom_type", "updated_at", "x", "y" FROM "title_buff_requests";
DROP TABLE "title_buff_requests";
ALTER TABLE "new_title_buff_requests" RENAME TO "title_buff_requests";
CREATE UNIQUE INDEX "title_buff_requests_discord_user_id_kingdom_type_governor_type_key" ON "title_buff_requests"("discord_user_id", "kingdom_type", "governor_type");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

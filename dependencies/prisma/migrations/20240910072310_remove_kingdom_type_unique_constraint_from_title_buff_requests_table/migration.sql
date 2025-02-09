/*
  Warnings:

  - A unique constraint covering the columns `[discord_user_id,governor_type]` on the table `title_buff_requests` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "title_buff_requests_discord_user_id_kingdom_type_governor_type_key";

-- CreateIndex
CREATE UNIQUE INDEX "title_buff_requests_discord_user_id_governor_type_key" ON "title_buff_requests"("discord_user_id", "governor_type");

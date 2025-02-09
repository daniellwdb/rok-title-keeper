-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_governor_connections" (
    "discord_user_id" TEXT NOT NULL,
    "governor_id" TEXT NOT NULL,
    "governor_type" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL,
    CONSTRAINT "governor_connections_governor_id_fkey" FOREIGN KEY ("governor_id") REFERENCES "governors" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_governor_connections" ("created_at", "discord_user_id", "governor_id", "governor_type", "updated_at") SELECT "created_at", "discord_user_id", "governor_id", "governor_type", "updated_at" FROM "governor_connections";
DROP TABLE "governor_connections";
ALTER TABLE "new_governor_connections" RENAME TO "governor_connections";
CREATE UNIQUE INDEX "governor_connections_discord_user_id_governor_type_key" ON "governor_connections"("discord_user_id", "governor_type");
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

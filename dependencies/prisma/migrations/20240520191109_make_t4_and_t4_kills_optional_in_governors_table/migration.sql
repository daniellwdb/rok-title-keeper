-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_governors" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "nickname" TEXT NOT NULL,
    "alliance" TEXT,
    "power" TEXT NOT NULL,
    "kill_points" TEXT NOT NULL,
    "tier_1_kills" TEXT NOT NULL,
    "tier_2_kills" TEXT NOT NULL,
    "tier_3_kills" TEXT NOT NULL,
    "tier_4_kills" TEXT,
    "tier_5_kills" TEXT,
    "dead" TEXT NOT NULL,
    "resource_assistance" TEXT NOT NULL,
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_governors" ("alliance", "created_at", "dead", "id", "kill_points", "nickname", "power", "resource_assistance", "tier_1_kills", "tier_2_kills", "tier_3_kills", "tier_4_kills", "tier_5_kills", "updated_at") SELECT "alliance", "created_at", "dead", "id", "kill_points", "nickname", "power", "resource_assistance", "tier_1_kills", "tier_2_kills", "tier_3_kills", "tier_4_kills", "tier_5_kills", "updated_at" FROM "governors";
DROP TABLE "governors";
ALTER TABLE "new_governors" RENAME TO "governors";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

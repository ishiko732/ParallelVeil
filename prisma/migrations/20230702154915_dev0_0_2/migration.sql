/*
  Warnings:

  - The primary key for the `Revlog` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `log_id` on the `Revlog` table. All the data in the column will be lost.
  - The required column `lid` was added to the `Revlog` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- RedefineTables
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_Revlog" (
    "lid" TEXT NOT NULL PRIMARY KEY,
    "cid" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "state" INTEGER NOT NULL,
    "scheduled_days" INTEGER NOT NULL,
    "review" DATETIME NOT NULL,
    CONSTRAINT "Revlog_cid_fkey" FOREIGN KEY ("cid") REFERENCES "Card" ("cid") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_Revlog" ("cid", "grade", "review", "scheduled_days", "state") SELECT "cid", "grade", "review", "scheduled_days", "state" FROM "Revlog";
DROP TABLE "Revlog";
ALTER TABLE "new_Revlog" RENAME TO "Revlog";
PRAGMA foreign_key_check;
PRAGMA foreign_keys=ON;

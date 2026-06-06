-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_FAQ" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT '通用',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "published" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_FAQ" ("answer", "createdAt", "id", "published", "question", "sortOrder", "updatedAt") SELECT "answer", "createdAt", "id", "published", "question", "sortOrder", "updatedAt" FROM "FAQ";
DROP TABLE "FAQ";
ALTER TABLE "new_FAQ" RENAME TO "FAQ";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

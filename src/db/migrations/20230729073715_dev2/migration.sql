-- CreateTable
CREATE TABLE "Revlog" (
    "lid" TEXT NOT NULL PRIMARY KEY,
    "cid" TEXT NOT NULL,
    "grade" INTEGER NOT NULL,
    "state" INTEGER NOT NULL,
    "scheduled_days" INTEGER NOT NULL,
    "review" DATETIME NOT NULL,
    CONSTRAINT "Revlog_cid_fkey" FOREIGN KEY ("cid") REFERENCES "Card" ("cid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Card" (
    "cid" TEXT NOT NULL PRIMARY KEY,
    "due" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "stability" REAL NOT NULL,
    "difficulty" REAL NOT NULL,
    "elapsed_days" INTEGER NOT NULL,
    "scheduled_days" INTEGER NOT NULL,
    "reps" INTEGER NOT NULL,
    "lapses" INTEGER NOT NULL,
    "state" INTEGER NOT NULL DEFAULT 0,
    "last_review" DATETIME,
    "type" INTEGER NOT NULL,
    "nid" TEXT,
    CONSTRAINT "Card_nid_fkey" FOREIGN KEY ("nid") REFERENCES "Note" ("nid") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Parameters" (
    "uid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "request_retention" DECIMAL NOT NULL DEFAULT 0.9,
    "maximum_interval" BIGINT NOT NULL DEFAULT 36500,
    "easy_bonus" DECIMAL NOT NULL DEFAULT 1.3,
    "hard_factor" DECIMAL NOT NULL DEFAULT 1.2,
    "w" TEXT NOT NULL DEFAULT '{"w":[1,1,5,-0.5,-0.5,0.2,1.4,-0.12,0.8,2,-0.2,0.2,1]}',
    "enable_fuzz" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Parameters_uid_fkey" FOREIGN KEY ("uid") REFERENCES "User" ("uid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "User" (
    "uid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "username" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Note" (
    "nid" TEXT NOT NULL PRIMARY KEY,
    "text" TEXT NOT NULL DEFAULT '',
    "answer" TEXT NOT NULL DEFAULT '',
    "type" TEXT NOT NULL DEFAULT 'Word',
    "parentId" TEXT,
    "language" TEXT NOT NULL DEFAULT 'en_US',
    "readed" BOOLEAN NOT NULL DEFAULT false,
    CONSTRAINT "Note_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "Note" ("nid") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "Article" (
    "aid" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "link" TEXT NOT NULL,
    "read" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL DEFAULT 0
);

-- CreateTable
CREATE TABLE "ArticleNote" (
    "aid" INTEGER NOT NULL,
    "nid" TEXT NOT NULL,
    "quote" TEXT NOT NULL,

    PRIMARY KEY ("aid", "nid"),
    CONSTRAINT "ArticleNote_nid_fkey" FOREIGN KEY ("nid") REFERENCES "Note" ("nid") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "ArticleNote_aid_fkey" FOREIGN KEY ("aid") REFERENCES "Article" ("aid") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateIndex
CREATE UNIQUE INDEX "Revlog_lid_key" ON "Revlog"("lid");

-- CreateIndex
CREATE UNIQUE INDEX "Card_cid_key" ON "Card"("cid");

-- CreateIndex
CREATE UNIQUE INDEX "Card_nid_key" ON "Card"("nid");

-- CreateIndex
CREATE UNIQUE INDEX "Parameters_uid_key" ON "Parameters"("uid");

-- CreateIndex
CREATE UNIQUE INDEX "Note_nid_key" ON "Note"("nid");

-- CreateIndex
CREATE UNIQUE INDEX "Article_aid_key" ON "Article"("aid");

-- CreateTable
CREATE TABLE "Revlog" (
    "log_id" TEXT NOT NULL PRIMARY KEY,
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
    "type" INTEGER NOT NULL
);

-- CreateTable
CREATE TABLE "Parameters" (
    "uid" BIGINT NOT NULL,
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
    "uid" BIGINT NOT NULL PRIMARY KEY,
    "username" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Parameters_uid_key" ON "Parameters"("uid");

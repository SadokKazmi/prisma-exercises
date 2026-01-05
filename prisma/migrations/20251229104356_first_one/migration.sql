-- CreateTable
CREATE TABLE "movies" (
    "id" SERIAL NOT NULL,
    "movieTitle" VARCHAR(250) NOT NULL,
    "movieGener" VARCHAR(250) NOT NULL,
    "movieReleaseDate" TIMESTAMP(3),
    "movieDirector" VARCHAR(250) NOT NULL,

    CONSTRAINT "movies_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "movies_movieTitle_key" ON "movies"("movieTitle");

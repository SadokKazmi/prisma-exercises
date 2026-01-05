/*
  Warnings:

  - You are about to drop the `movies` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "movies";

-- CreateTable
CREATE TABLE "movie" (
    "id" SERIAL NOT NULL,
    "movieTitle" VARCHAR(250) NOT NULL,
    "directorId" INTEGER NOT NULL,
    "movieReleaseDate" INTEGER NOT NULL,

    CONSTRAINT "movie_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Genre" (
    "id" SERIAL NOT NULL,
    "generTitle" TEXT NOT NULL,

    CONSTRAINT "Genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Director" (
    "id" SERIAL NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,

    CONSTRAINT "Director_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_MoviesGenres" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_MoviesGenres_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "movie_movieTitle_key" ON "movie"("movieTitle");

-- CreateIndex
CREATE UNIQUE INDEX "Genre_generTitle_key" ON "Genre"("generTitle");

-- CreateIndex
CREATE INDEX "_MoviesGenres_B_index" ON "_MoviesGenres"("B");

-- AddForeignKey
ALTER TABLE "movie" ADD CONSTRAINT "movie_directorId_fkey" FOREIGN KEY ("directorId") REFERENCES "Director"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MoviesGenres" ADD CONSTRAINT "_MoviesGenres_A_fkey" FOREIGN KEY ("A") REFERENCES "Genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_MoviesGenres" ADD CONSTRAINT "_MoviesGenres_B_fkey" FOREIGN KEY ("B") REFERENCES "movie"("id") ON DELETE CASCADE ON UPDATE CASCADE;

/*
  Warnings:

  - You are about to drop the `Director` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Genre` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_GenreToMovie" DROP CONSTRAINT "_GenreToMovie_A_fkey";

-- DropForeignKey
ALTER TABLE "movie" DROP CONSTRAINT "movie_directorId_fkey";

-- DropTable
DROP TABLE "Director";

-- DropTable
DROP TABLE "Genre";

-- CreateTable
CREATE TABLE "genre" (
    "id" SERIAL NOT NULL,
    "genreTitle" TEXT NOT NULL,

    CONSTRAINT "genre_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "director" (
    "id" SERIAL NOT NULL,
    "movieDirector" TEXT NOT NULL,

    CONSTRAINT "director_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "genre_genreTitle_key" ON "genre"("genreTitle");

-- AddForeignKey
ALTER TABLE "movie" ADD CONSTRAINT "movie_directorId_fkey" FOREIGN KEY ("directorId") REFERENCES "director"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_GenreToMovie" ADD CONSTRAINT "_GenreToMovie_A_fkey" FOREIGN KEY ("A") REFERENCES "genre"("id") ON DELETE CASCADE ON UPDATE CASCADE;

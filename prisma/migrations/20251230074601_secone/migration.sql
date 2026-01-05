/*
  Warnings:

  - You are about to drop the `_MoviesGenres` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `movieId` to the `Genre` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "_MoviesGenres" DROP CONSTRAINT "_MoviesGenres_A_fkey";

-- DropForeignKey
ALTER TABLE "_MoviesGenres" DROP CONSTRAINT "_MoviesGenres_B_fkey";

-- AlterTable
ALTER TABLE "Genre" ADD COLUMN     "movieId" INTEGER NOT NULL;

-- DropTable
DROP TABLE "_MoviesGenres";

-- AddForeignKey
ALTER TABLE "Genre" ADD CONSTRAINT "Genre_movieId_fkey" FOREIGN KEY ("movieId") REFERENCES "movie"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

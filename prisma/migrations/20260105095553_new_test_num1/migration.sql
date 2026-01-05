/*
  Warnings:

  - A unique constraint covering the columns `[movieDirector]` on the table `director` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "director_movieDirector_key" ON "director"("movieDirector");

/*
  Warnings:

  - A unique constraint covering the columns `[apelido]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "User_apelido_key" ON "User"("apelido");

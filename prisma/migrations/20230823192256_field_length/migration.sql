/*
  Warnings:

  - You are about to alter the column `apelido` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(32)`.
  - You are about to alter the column `nome` on the `User` table. The data in that column could be lost. The data in that column will be cast from `Text` to `VarChar(100)`.

*/
-- AlterTable
ALTER TABLE "User" ALTER COLUMN "apelido" SET DATA TYPE VARCHAR(32),
ALTER COLUMN "nome" SET DATA TYPE VARCHAR(100);

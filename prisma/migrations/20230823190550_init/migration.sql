-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "apelido" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "nascimento" TIMESTAMP(3) NOT NULL,
    "stack" TEXT[],

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

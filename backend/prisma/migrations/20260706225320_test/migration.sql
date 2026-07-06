/*
  Warnings:

  - A unique constraint covering the columns `[email]` on the table `producers` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "producers_email_key" ON "producers"("email");

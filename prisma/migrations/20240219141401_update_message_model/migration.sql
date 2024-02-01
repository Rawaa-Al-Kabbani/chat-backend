/*
  Warnings:

  - You are about to drop the column `user_name` on the `Message` table. All the data in the column will be lost.
  - Added the required column `user_id` to the `Message` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Message" DROP COLUMN "user_name",
ADD COLUMN     "user_id" TEXT NOT NULL;

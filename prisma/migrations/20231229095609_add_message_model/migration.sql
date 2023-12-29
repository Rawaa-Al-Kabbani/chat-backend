-- CreateTable
CREATE TABLE "Message" (
    "id" SERIAL NOT NULL,
    "user_name" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,

    CONSTRAINT "Message_pkey" PRIMARY KEY ("id")
);

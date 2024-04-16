-- CreateTable
CREATE TABLE "Lodgings" (
    "id" TEXT NOT NULL,
    "name" VARCHAR(255) NOT NULL,
    "facility" TEXT NOT NULL,
    "imgUrl" VARCHAR(255) NOT NULL,
    "AuthorId" TEXT NOT NULL,
    "location" VARCHAR(255) NOT NULL,
    "price" INTEGER NOT NULL,
    "TypeId" TEXT NOT NULL,
    "status" VARCHAR(255) NOT NULL DEFAULT 'Active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Lodgings_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Lodgings" ADD CONSTRAINT "Lodgings_AuthorId_fkey" FOREIGN KEY ("AuthorId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Lodgings" ADD CONSTRAINT "Lodgings_TypeId_fkey" FOREIGN KEY ("TypeId") REFERENCES "Types"("id") ON DELETE CASCADE ON UPDATE CASCADE;

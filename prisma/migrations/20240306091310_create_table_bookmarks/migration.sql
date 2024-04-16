-- CreateTable
CREATE TABLE "Bookmarks" (
    "id" TEXT NOT NULL,
    "UserId" TEXT NOT NULL,
    "LodgingId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Bookmarks_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Bookmarks" ADD CONSTRAINT "Bookmarks_UserId_fkey" FOREIGN KEY ("UserId") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Bookmarks" ADD CONSTRAINT "Bookmarks_LodgingId_fkey" FOREIGN KEY ("LodgingId") REFERENCES "Lodgings"("id") ON DELETE CASCADE ON UPDATE CASCADE;

import prisma from "../config/prisma";
import validate from "../helpers/validate";
import { CreateBookmarkDTO, bookmarkSchema } from "../schemas/bookmark-schema";

export default class Bookmark {
  static async create(param: CreateBookmarkDTO) {
    const data = validate(bookmarkSchema, param);

    await prisma.lodging.findUniqueOrThrow({
      where: { id: data.LodgingId },
    });

    return await prisma.bookmark.create({ data });
  }

  static async findMany(UserId: string) {
    return await prisma.bookmark.findMany({
      where: { UserId },
      orderBy: [{ createdAt: "desc" }],
      select: {
        UserId: true,
        Lodging: {
          select: {
            id: true,
            name: true,
            facility: true,
            roomCapacity: true,
            imgUrl: true,
            price: true,
            location: true,
            Type: { select: { id: true, name: true } },
          },
        },
      },
    });
  }

  static async delete(UserId: string, LodgingId: string) {
    return await prisma.bookmark.deleteMany({ where: { UserId, LodgingId } });
  }
}

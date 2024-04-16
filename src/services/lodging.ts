import prisma from "../config/prisma";
import validate from "../helpers/validate";
import {
  CreateLodgingPayload,
  UpdateLodgingPayload,
  lodgingCreateSchema,
  lodgingUpdateSchema,
} from "../schemas/lodging-schema";
import History from "./history";

export default class Lodging {
  static client = prisma;

  static async count(TypeId?: string) {
    const option: Record<string, any> = {};

    if (TypeId) {
      option.where = { TypeId };
    }

    return await this.client.lodging.count(option);
  }

  static async findMany(take?: number, skip?: number, TypeId?: string) {
    const option: Record<string, any> = {
      select: {
        id: true,
        name: true,
        facility: true,
        roomCapacity: true,
        imgUrl: true,
        location: true,
        price: true,
        status: true,
        Author: {
          select: { id: true, username: true, email: true, role: true },
        },
        Type: {
          select: { id: true, name: true },
        },
      },
      orderBy: [{ createdAt: "asc" }],
    };

    if (TypeId) {
      option.where = { TypeId };
    }

    if (take) {
      option.take = take;
    }

    if (skip) {
      option.skip = skip;
    }

    return await prisma.lodging.findMany(option);
  }

  static async findOne(id: string) {
    return await prisma.lodging.findUniqueOrThrow({
      where: { id },
      include: {
        Author: {
          select: { id: true, username: true, email: true, role: true },
        },
        Type: {
          select: { id: true, name: true },
        },
      },
    });
  }

  static async create(param: CreateLodgingPayload) {
    return await prisma.$transaction(async (tx) => {
      const data = validate(lodgingCreateSchema, param);
      const lodging = await tx.lodging.create({
        data,
        include: { Author: { select: { email: true } } },
      });

      await tx.history.create({
        data: {
          title: lodging.name,
          description: `new Lodging with id ${lodging.id} created`,
          updatedBy: lodging.Author.email,
        },
      });

      return lodging;
    });
  }

  static async update(id: string, param: UpdateLodgingPayload) {
    return await prisma.$transaction(async (tx) => {
      await prisma.lodging.findUniqueOrThrow({ where: { id } });

      const data = validate(lodgingUpdateSchema, param);

      const lodging = await tx.lodging.update({
        where: { id },
        data,
        include: { Author: { select: { email: true } } },
      });

      await tx.history.create({
        data: {
          title: lodging.name,
          description: `Lodging with id ${lodging.id} updated`,
          updatedBy: lodging.Author.email,
        },
      });

      return lodging;
    });
  }

  static async delete(id: string) {
    await prisma.lodging.findUniqueOrThrow({ where: { id } });

    return await prisma.lodging.delete({ where: { id } });
  }
}

import { PrismaClient } from "@prisma/client";
import types from "../data/types.json";
import lodgings from "../data/lodgings.json";
import User from "../src/services/user";
const url: string = process.env.DATABASE_URL as string;

const prisma = new PrismaClient({ datasources: { db: { url } } });

(async function () {
  try {
    const alvin = await User.register({
      username: "alvinbudih",
      email: "alvin@mail.com",
      password: "password",
      role: "Admin",
    });
    await prisma.type.createMany({ data: types });
    const typesCreated = await prisma.type.findMany();

    const lodgingPayload = lodgings.map((lodging) => {
      const TypeId = typesCreated.find(
        (type) => type.name === lodging.Type.name
      )?.id;
      return {
        name: lodging.name,
        facility: lodging.facility,
        roomCapacity: lodging.roomCapacity,
        imgUrl: lodging.imgUrl,
        location: lodging.location,
        price: lodging.price,
        status: lodging.status,
        TypeId,
        AuthorId: alvin.id,
      };
    });

    await prisma.lodging.createMany({ data: lodgingPayload as any });
  } catch (error) {
    console.log(error);
  } finally {
    await prisma.$disconnect();
    process.exit(1);
  }
})();

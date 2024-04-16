import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";
import { RegisterPayload } from "../src/schemas/user-schema";
const url: string = process.env.DATABASE_TEST_URL as string;

const prisma = new PrismaClient({ datasources: { db: { url } } }).$extends({
  model: {
    user: {
      async register(data: RegisterPayload) {
        data.password = hashSync(data.password);
        return await prisma.user.create({ data });
      },
    },
  },
});

export default prisma;

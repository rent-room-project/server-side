import { PrismaClient } from "@prisma/client";
import { hashSync } from "bcryptjs";
import { RegisterPayload } from "../schemas/user-schema";
const env: string = process.env.NODE_ENV || "development";
const url: string = (
  env === "test" ? process.env.DATABASE_TEST_URL : process.env.DATABASE_URL
) as string;

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

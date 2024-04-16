import prisma from "../config/prisma";

export default class History {
  static async findMany() {
    return await prisma.history.findMany({ orderBy: [{ createdAt: "desc" }] });
  }
}

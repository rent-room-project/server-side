import prisma from "../config/prisma";

export default class Type {
  static async getTypes() {
    return await prisma.type.findMany();
  }
}

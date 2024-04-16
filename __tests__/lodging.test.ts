import supertest from "supertest";
import lodgings from "../data/lodgings.json";
import types from "../data/types.json";
import prisma from "../prisma/init";
import app from "../src/app";
import { v4 } from "uuid";

const request = supertest;

beforeAll(async () => {
  try {
    const user = await prisma.user.create({
      data: {
        username: "admin",
        email: "admin@mail.com",
        password: "password",
        role: "Admin",
      },
    });

    await prisma.type.createMany({ data: types });
    const lodgingPayload: Array<{
      name: string;
      facility: string;
      roomCapacity: number;
      imgUrl: string;
      location: string;
      price: number;
      TypeId: string;
      AuthorId: string;
    }> = [];

    for (const lodging of lodgings) {
      const Type = await prisma.type.findFirst({
        where: { name: lodging.Type.name },
      });
      lodgingPayload.push({
        name: lodging.name,
        facility: lodging.facility,
        roomCapacity: lodging.roomCapacity,
        imgUrl: lodging.imgUrl,
        location: lodging.location,
        price: lodging.price,
        TypeId: Type?.id as string,
        AuthorId: user.id,
      });
    }

    await prisma.lodging.createMany({ data: lodgingPayload });
  } catch (error) {
    console.log(error);
  }
});

afterAll(async () => {
  try {
    await prisma.lodging.deleteMany();
    await prisma.type.deleteMany();
    await prisma.user.deleteMany();
  } catch (error) {
    console.log(error);
  }
});

describe("Lodging Entity", () => {
  describe("GET /public/lodgings", () => {
    it("should get lodgings without query and return status 200", async () => {
      const response = await request(app).get("/public/lodgings");

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("lodgings", expect.any(Array));
      expect(response.body.lodgings).toHaveLength(20);
    });
  });

  describe("GET /public/lodgings?typeId=:typeId", () => {
    it("should get lodgings with query filter hotel and return status 200", async () => {
      const type = await prisma.type.findFirst({ where: { name: "Hotel" } });
      const response = await request(app).get(
        `/public/lodgings?typeId=${type?.id}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("lodgings", expect.any(Array));
    });

    it("should get lodgings with query filter motel and return status 200", async () => {
      const type = await prisma.type.findFirst({ where: { name: "Motel" } });
      const response = await request(app).get(
        `/public/lodgings?typeId=${type?.id}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("lodgings", expect.any(Array));
    });

    it("should get lodgings with query filter apartment and return status 200", async () => {
      const type = await prisma.type.findFirst({
        where: { name: "Apartment" },
      });
      const response = await request(app).get(
        `/public/lodgings?typeId=${type?.id}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("lodgings", expect.any(Array));
    });
  });

  describe("GET /public/lodgings?perPage=:perPage&page=:page", () => {
    it("should get lodgings with query perPage and return status 200", async () => {
      const response = await request(app).get(
        `/public/lodgings?perPage=9&page=1`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("lodgings", expect.any(Array));
      expect(response.body.lodgings).toHaveLength(9);
    });

    it("should get lodgings with query perPage and return status 200", async () => {
      const response = await request(app).get(
        `/public/lodgings?perPage=9&page=2`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("lodgings", expect.any(Array));
      expect(response.body.lodgings).toHaveLength(9);
    });
  });

  describe("GET /public/lodgings/:id", () => {
    it("should get lodging with id and return status 200", async () => {
      const lodging = await prisma.lodging.findFirst();

      const response = await request(app).get(
        `/public/lodgings/${lodging?.id}`
      );

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("id", lodging?.id);
    });

    it("should failed get lodging with id and return status 404", async () => {
      const id = v4();

      const response = await request(app).get(`/public/lodgings/${id}`);

      expect(response.status).toBe(404);
      expect(response.body).toHaveProperty("message", "No Lodging found");
    });
  });
});

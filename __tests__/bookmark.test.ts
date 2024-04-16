import "dotenv/config";
import { sign } from "jsonwebtoken";
import lodgings from "../data/lodgings.json";
import types from "../data/types.json";
import prisma from "../prisma/init";
import supertest from "supertest";
import app from "../src/app";
import { v4 } from "uuid";

const request = supertest;

let validToken: string;
let invalidToken =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhc2FsQG1haWwuY29tIiwicm9sZSI6IkN1c3RvbWVyIn0.Aq-sC5eZvmP491nfkrr0Qovns0Cyh8uslhpcRacGw4I";
const secret = process.env.JWT_TOKEN;

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
    const bookmarked = await prisma.lodging.findMany({ take: 3 });

    await prisma.bookmark.createMany({
      data: bookmarked.map((lodging) => ({
        UserId: user.id,
        LodgingId: lodging.id,
      })),
    });

    validToken = sign(
      { id: user.id, username: user.username, email: user.email },
      secret as string
    );
  } catch (error) {
    console.log(error);
  }
});

afterAll(async () => {
  try {
    await prisma.user.deleteMany();
    await prisma.type.deleteMany();
  } catch (error) {
    console.log(error);
  }
});

describe("Bookmark Entity", () => {
  describe("GET /public/bookmarks", () => {
    it("should successfully get bookmarks and return status 200", async () => {
      const response = await request(app)
        .get("/public/bookmarks")
        .set("access_token", validToken);

      expect(response.status).toBe(200);
      expect(response.body).toBeInstanceOf(Array);
      expect(response.body).toHaveLength(3);
    });

    it("should failed get bookmarks when not sign in yet and return status 401", async () => {
      const response = await request(app).get("/public/bookmarks");

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "Unauthenticated");
    });

    it("should failed get bookmarks when invalid token and return status 401", async () => {
      const response = await request(app)
        .get("/public/bookmarks")
        .set("access_token", invalidToken);

      expect(response.status).toBe(401);
      expect(response.body).toHaveProperty("message", "invalid signature");
    });
  });

  describe("POST /public/bookmarks/:LodgingId", () => {
    it("should successfully add bookmark and return status 201", async () => {
      const lodging = await prisma.lodging.findFirst({
        where: { name: "Tokyo Cubo" },
      });

      const response = await request(app)
        .post(`/public/bookmarks/${lodging?.id}`)
        .set("access_token", validToken);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("LodgingId", lodging?.id);
    });

    it("should failed add bookmark and return status 201", async () => {
      const id = v4();

      const response = await request(app)
        .post(`/public/bookmarks/${id}`)
        .set("access_token", validToken);

      expect(response.status).toBe(404);
    });
  });
});

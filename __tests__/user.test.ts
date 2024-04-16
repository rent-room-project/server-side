import supertest from "supertest";
import app from "../src/app";
import prisma from "../prisma/init";

const request = supertest;

afterAll(async () => {
  await prisma.user.deleteMany();
});

describe("User Entitity", () => {
  describe("POST /public/register", () => {
    it("should register user and return status 201", async () => {
      const body = {
        username: "test",
        email: "test@mail.com",
        password: "password",
      };

      const response = await request(app).post("/public/register").send(body);

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty("username", body.username);
      expect(response.body).toHaveProperty("email", body.email);
    });

    it("should failed register user and return status 400 if email is empty", async () => {
      const body = {
        username: "test",
        email: "",
        password: "password",
      };

      const response = await request(app).post("/public/register").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Email must be a valid Email"
      );
    });

    it("should failed register user and return status 400 if username is null", async () => {
      const body = {
        username: "test",
        password: "password",
      };

      const response = await request(app).post("/public/register").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Email is required");
    });

    it("should failed register user and return status 400 if password is empty", async () => {
      const body = {
        username: "test",
        email: "test@mail.com",
        password: "",
      };

      const response = await request(app).post("/public/register").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Password must have at least 5 characters"
      );
    });

    it("should failed register user and return status 400 if password is null", async () => {
      const body = {
        username: "test",
        email: "test@mail.com",
      };

      const response = await request(app).post("/public/register").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Password is required");
    });

    it("should failed register user and return status 400 if email is registered", async () => {
      const body = {
        username: "test",
        email: "test@mail.com",
        password: "password",
      };

      const response = await request(app).post("/public/register").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty("message", "Email is registered");
    });

    it("should failed register user and return status 400 if invalid email", async () => {
      const body = {
        username: "test",
        email: "test@mail",
        password: "password",
      };

      const response = await request(app).post("/public/register").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Email must be a valid Email"
      );
    });
  });

  describe("POST /public/login", () => {
    it("should successfully login and return status 200", async () => {
      const body = {
        email: "test@mail.com",
        password: "password",
      };

      const response = await request(app).post("/public/login").send(body);

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty("access_token");
    });

    it("should failed login and return status 400 if wrong password", async () => {
      const body = {
        email: "test@mail.com",
        password: "secret",
      };

      const response = await request(app).post("/public/login").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Invalid Email or Password"
      );
    });

    it("should failed login and return status 400 if wrong email", async () => {
      const body = {
        email: "wrong@mail.com",
        password: "password",
      };

      const response = await request(app).post("/public/login").send(body);

      expect(response.status).toBe(400);
      expect(response.body).toHaveProperty(
        "message",
        "Invalid Email or Password"
      );
    });
  });
});

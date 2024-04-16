import validate from "../helpers/validate";
import {
  LoginPayload,
  RegisterPayload,
  loginSchema,
  userSchema,
} from "../schemas/user-schema";
import { compareSync } from "bcryptjs";
import UniqueError from "../helpers/errors/unique-error";
import InvalidError from "../helpers/errors/invalid-error";
import { sign } from "jsonwebtoken";
import prisma from "../config/prisma";
import { TokenPayload } from "google-auth-library";

const secret = process.env.JWT_TOKEN;

export default class User {
  static async register(param: RegisterPayload) {
    const data = validate(userSchema, param);

    const isRegistered = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (isRegistered) {
      throw new UniqueError("Email is registered", 400);
    }

    const result = await prisma.user.register(data);

    return result;
  }

  static async login(param: LoginPayload, isCustomer: boolean = false) {
    const data = validate(loginSchema, param);

    const user = await prisma.user.findUnique({
      where: {
        email: data.email,
        ...(isCustomer
          ? { role: "Customer" }
          : { OR: [{ role: "Admin" }, { role: "Staff" }] }),
      },
    });

    if (!user || !compareSync(data.password, user.password)) {
      throw new InvalidError("Invalid Email or Password", 400);
    }

    return {
      access_token: sign(
        { id: user.id, username: user.username, email: user.email },
        secret!
      ),
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }

  static async signInGoogle(param: TokenPayload, isCustomer: boolean = false) {
    const user = await prisma.user.findUnique({
      where: {
        email: param.email,
      },
    });

    if (!user) {
      const username = param.email?.split("@")[0];
      const role = isCustomer ? "Customer" : "Staff";

      const data = await prisma.user.create({
        data: {
          username: username!,
          email: param.email!,
          password: "password",
          role,
        },
      });

      return {
        access_token: sign(
          { id: data.id, username: data.username, email: data.email },
          secret!
        ),
        username: data.username,
        email: data.email,
        role: data.role,
      };
    }

    return {
      access_token: sign(
        { id: user.id, username: user.username, email: user.email },
        secret!
      ),
      username: user.username,
      email: user.email,
      role: user.role,
    };
  }

  static async getProfile(id: string) {
    const user = await prisma.user.findUniqueOrThrow({
      where: { id },
      select: {
        id: true,
        username: true,
        email: true,
        role: true,
        address: true,
        phoneNumber: true,
      },
    });

    return user;
  }
}

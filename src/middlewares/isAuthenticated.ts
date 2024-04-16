import { NextFunction, Request, Response } from "express";
import { verify } from "jsonwebtoken";
import prisma from "../config/prisma";
import { CustomRequest, PayloadToken } from "../helpers/types";
import UnauthenticatedError from "../helpers/errors/unauthenticated-error";
const secret = process.env.JWT_TOKEN as string;

export default async function isAuthenticated(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("is authenticated");

  try {
    const {
      headers: { access_token },
    } = req;

    if (!access_token) {
      throw new UnauthenticatedError("Unauthenticated", 401);
    }

    const payload = verify(access_token as string, secret) as PayloadToken;

    const user = await prisma.user.findUnique({
      where: { email: payload.email, id: payload.id },
    });

    if (!user) {
      throw new UnauthenticatedError("Unauthenticated", 401);
    }

    (req as CustomRequest).user = payload;
    next();
  } catch (error) {
    next(error);
  }
}

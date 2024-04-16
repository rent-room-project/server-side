import { NextFunction, Request, Response } from "express";
import { CustomRequest } from "../helpers/types";
import User from "../services/user";
import Lodging from "../services/lodging";
import ForbiddenError from "../helpers/errors/forbidden-error";

export default async function isLodgingAuthorized(
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("admin lodging middleware");

  try {
    const {
      user: { id: userId },
      params: { id },
    } = req as CustomRequest;

    const user = await User.getProfile(userId);
    const lodging = await Lodging.findOne(id);

    if (user.role !== "Admin" || lodging.AuthorId !== user.id) {
      throw new ForbiddenError("Forbidden", 403);
    }

    next();
  } catch (error) {
    next(error);
  }
}

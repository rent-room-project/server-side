import { NextFunction, Request, Response } from "express";
import User from "../services/user";
import Lodging from "../services/lodging";
import Type from "../services/type";
import Bookmark from "../services/bookmark";
import { CustomRequest } from "../helpers/types";
import { NotFoundError } from "@prisma/client/runtime/library";
import cleanNullishValue from "../helpers/cleanNullishValue";

export default class PublicController {
  static async register(req: Request, res: Response, next: NextFunction) {
    console.log("public register api...");

    try {
      const {
        body: { username, email, password, phoneNumber, address },
      } = req;

      const payload = cleanNullishValue({
        username,
        email,
        password,
        role: "Customer",
        phoneNumber,
        address,
      });

      const data = await User.register(payload);

      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    console.log("public login api...");

    try {
      const {
        body: { email, password },
      } = req;

      const payload = cleanNullishValue({ email, password });

      const result = await User.login(payload, true);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async getLodgings(req: Request, res: Response, next: NextFunction) {
    console.log("public list lodging api...");

    try {
      const {
        query: { typeId, page = 1, perPage, search },
      } = req;

      let take: number = 0;
      let skip: number = 0;

      if (perPage) {
        take = Number(perPage);
        skip = take * Number(page) - take;
      }

      const totalData = await Lodging.count(typeId as string, search as string);
      const totalPage = Math.ceil(totalData / take);
      const lodgings = await Lodging.findMany(
        take,
        skip,
        typeId as string,
        search as string
      );

      res.json({ totalData, totalPage, lodgings });
    } catch (error) {
      next(error);
    }
  }

  static async getLodgingById(req: Request, res: Response, next: NextFunction) {
    console.log("public get lodging api...");

    try {
      const {
        params: { id },
      } = req;

      const lodging = await Lodging.findOne(id);

      res.json(lodging);
    } catch (error) {
      next(error);
    }
  }

  static async getTypes(req: Request, res: Response, next: NextFunction) {
    console.log("public list type api...");

    try {
      const types = await Type.getTypes();

      res.json(types);
    } catch (error) {
      next(error);
    }
  }

  static async getBookmarks(req: Request, res: Response, next: NextFunction) {
    console.log("public list bookmark api...");

    try {
      const bookmarks = await Bookmark.findMany((req as CustomRequest).user.id);

      res.json(bookmarks);
    } catch (error) {
      next(error);
    }
  }

  static async addBookmark(req: Request, res: Response, next: NextFunction) {
    console.log("public create bookmark api...");

    try {
      const {
        user: { id: UserId },
        params: { LodgingId },
      } = req as CustomRequest;

      const data = await Bookmark.create({ UserId, LodgingId });

      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async deleteBookmark(req: Request, res: Response, next: NextFunction) {
    console.log("public delete bookmark api...");

    try {
      const {
        user: { id: UserId },
        params: { LodgingId },
      } = req as CustomRequest;

      const { count } = await Bookmark.delete(UserId, LodgingId);

      if (!count) {
        throw new NotFoundError("No Bookmark found", "5.10.2");
      }

      res.json({ message: "Bookmark deleted" });
    } catch (error) {
      next(error);
    }
  }
}

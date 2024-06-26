import { NextFunction, Request, Response } from "express";
import User from "../services/user";
import Lodging from "../services/lodging";
import Type from "../services/type";
import Bookmark from "../services/bookmark";
import { CustomRequest } from "../helpers/types";
import { NotFoundError } from "@prisma/client/runtime/library";
import cleanNullishValue from "../helpers/cleanNullishValue";
import { OAuth2Client } from "google-auth-library";
import * as midtransClient from "midtrans-client";
const googleClient = process.env.GOOGLE_CLIENT_ID!;
const midtransServerKey = process.env.MIDTRANS_SERVER_KEY!;

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

  static async googleSignIn(req: Request, res: Response, next: NextFunction) {
    console.log("public google login api...");

    try {
      const {
        headers: { google_token },
      } = req;

      const client = new OAuth2Client();

      const ticket = await client.verifyIdToken({
        idToken: google_token as string,
        audience: googleClient,
      });

      const payload = ticket.getPayload();

      const result = await User.signInGoogle(payload!, true);

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

  static async generateMidtransToken(
    req: Request,
    res: Response,
    next: NextFunction
  ) {
    console.log("payment gateway api...");

    try {
      const {
        params: { lodgingId },
        user: { username, email },
      } = req as CustomRequest;

      const lodging = await Lodging.findOne(lodgingId);

      const snap = new midtransClient.Snap({
        isProduction: false,
        serverKey: midtransServerKey,
      });

      const param = {
        transaction_details: {
          order_id: `ORDER_${
            Math.floor(Math.random() * (999999 - 100000 + 1)) + 1
          }`,
          gross_amount: lodging.price,
        },
        credit_card: {
          secure: true,
        },
        customer_details: {
          first_name: username,
          email,
        },
      };

      const result = await snap.createTransaction(param);
      res.json(result);
    } catch (error) {
      console.log(error);
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
      const {
        user: { id: userId },
      } = req as CustomRequest;

      const bookmarks = await Bookmark.findMany(userId);

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

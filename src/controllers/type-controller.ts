import { NextFunction, Request, Response } from "express";
import Type from "../services/type";
import { CustomRequest } from "../helpers/types";

export default class TypeController {
  static async getTypes(req: Request, res: Response, next: NextFunction) {
    console.log("list types api..");

    try {
      const types = await Type.getTypes();

      res.json(types);
    } catch (error) {
      next(error);
    }
  }
}

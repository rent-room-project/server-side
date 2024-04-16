import { NextFunction, Request, Response } from "express";
import History from "../services/history";

export default class HistoryController {
  static async getHistories(req: Request, res: Response, next: NextFunction) {
    console.log("list history api...");

    try {
      const histories = await History.findMany();

      res.json(histories);
    } catch (error) {
      next(error);
    }
  }
}

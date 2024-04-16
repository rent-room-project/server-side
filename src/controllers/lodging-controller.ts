import { NextFunction, Request, Response } from "express";
import Lodging from "../services/lodging";
import { CustomRequest } from "../helpers/types";
import cleanNullishValue from "../helpers/cleanNullishValue";

export default class LodgingController {
  static async getLodgings(req: Request, res: Response, next: NextFunction) {
    console.log("list lodging api...");

    try {
      const lodgings = await Lodging.findMany();

      res.json(lodgings);
    } catch (error) {
      next(error);
    }
  }

  static async createLodging(req: Request, res: Response, next: NextFunction) {
    console.log("create lodging api...");

    try {
      const {
        body: { name, facility, roomCapacity, imgUrl, location, price, TypeId },
        user: { id: userId },
      } = req as CustomRequest;

      const data = await Lodging.create({
        name,
        facility,
        roomCapacity: Number(roomCapacity),
        imgUrl,
        location,
        price: Number(price),
        TypeId,
        AuthorId: userId,
      });

      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  static async getLodging(req: Request, res: Response, next: NextFunction) {
    console.log("get lodging api...");

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

  static async updateLodging(req: Request, res: Response, next: NextFunction) {
    console.log("update lodging api...");

    try {
      const {
        params: { id },
        body: {
          name,
          facility,
          roomCapacity,
          imgUrl,
          location,
          price,
          status,
          TypeId,
        },
      } = req;

      const payload = cleanNullishValue({
        name,
        facility,
        roomCapacity,
        imgUrl,
        location,
        price,
        status,
        TypeId,
      });

      const data = await Lodging.update(id, payload);

      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  static async deleteLodging(req: Request, res: Response, next: NextFunction) {
    console.log("delete lodging api...");

    try {
      const {
        params: { id },
      } = req;

      const data = await Lodging.delete(id);

      res.json(data);
    } catch (error) {
      next(error);
    }
  }
}

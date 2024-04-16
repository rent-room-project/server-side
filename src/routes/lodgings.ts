import express from "express";
import LodgingController from "../controllers/lodging-controller";
import isLodgingAuthorized from "../middlewares/isLodgingAuthorized";

const lodgings = express.Router();

lodgings.get("/", LodgingController.getLodgings);

lodgings.post("/", LodgingController.createLodging);

lodgings.get("/:id", LodgingController.getLodging);

lodgings.use("/:id", isLodgingAuthorized);

lodgings.patch("/:id", LodgingController.updateLodging);

lodgings.delete("/:id", LodgingController.deleteLodging);

export default lodgings;

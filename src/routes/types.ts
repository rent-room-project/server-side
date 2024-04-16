import express from "express";
import TypeController from "../controllers/type-controller";

const types = express.Router();

types.get("/", TypeController.getTypes);

export default types;

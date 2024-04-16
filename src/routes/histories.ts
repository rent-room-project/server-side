import express from "express";
import HistoryController from "../controllers/history-controller";

const histories = express.Router();

histories.get("/", HistoryController.getHistories);

export default histories;

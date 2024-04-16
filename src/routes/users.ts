import express from "express";
import UserController from "../controllers/user-controller";
const users = express.Router();

users.get("/", UserController.getProfile);

export default users;

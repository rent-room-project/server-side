import express from "express";
import UserController from "../controllers/user-controller";

const guest = express.Router();

guest.post("/register", UserController.register);
guest.post("/login", UserController.login);
guest.post("/google-login", UserController.googleSignIn);

export default guest;

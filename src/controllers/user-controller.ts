import { NextFunction, Request, Response } from "express";
import User from "../services/user";
import cleanNullishValue from "../helpers/cleanNullishValue";
import { CustomRequest } from "../helpers/types";
import { OAuth2Client } from "google-auth-library";
const googleClient = process.env.GOOGLE_CLIENT_ID!;

export default class UserController {
  static async register(req: Request, res: Response, next: NextFunction) {
    console.log("register api...");

    try {
      const {
        body: { username, email, password, phoneNumber, address },
      } = req;

      const payload = cleanNullishValue({
        username,
        email,
        password,
        phoneNumber,
        address,
      });

      const result = await User.register({ ...payload, role: "Admin" });

      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }

  static async login(req: Request, res: Response, next: NextFunction) {
    console.log("login api...");

    try {
      const {
        body: { email, password },
      } = req;

      const payload = cleanNullishValue({ email, password });

      const result = await User.login(payload);

      res.json(result);
    } catch (error) {
      next(error);
    }
  }

  static async googleSignIn(req: Request, res: Response, next: NextFunction) {
    console.log("google login api...");

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

      const { access_token, email, role, username } = await User.signInGoogle(
        payload!
      );

      res.json({ access_token, email, username, role });
    } catch (error) {
      next(error);
    }
  }

  static async getProfile(req: Request, res: Response, next: NextFunction) {
    console.log("get profile api...");

    try {
      const {
        user: { id },
      } = req as CustomRequest;

      const user = await User.getProfile(id);

      res.json(user);
    } catch (error) {
      next(error);
    }
  }
}

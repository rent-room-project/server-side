import { Request } from "express";

export type PayloadToken = {
  id: string;
  username: string;
  email: string;
};

export interface CustomRequest extends Request {
  user: PayloadToken;
}

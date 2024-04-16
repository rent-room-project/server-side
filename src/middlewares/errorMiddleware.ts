import { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import UniqueError from "../helpers/errors/unique-error";
import InvalidError from "../helpers/errors/invalid-error";
import UnauthenticatedError from "../helpers/errors/unauthenticated-error";
import { NotFoundError } from "@prisma/client/runtime/library";
import { JsonWebTokenError } from "jsonwebtoken";
import ForbiddenError from "../helpers/errors/forbidden-error";

export default function errorMiddleware(
  error: Error,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.log("error middleware..");

  let status: number;
  let message: string;

  switch (true) {
    case error instanceof JsonWebTokenError:
      status = 401;
      message = error.message;
      break;

    case error instanceof UnauthenticatedError:
    case error instanceof InvalidError:
    case error instanceof UniqueError:
    case error instanceof ForbiddenError:
      status = error.statusCode;
      message = error.message;
      break;

    case error instanceof NotFoundError:
      status = 404;
      message = error.message;
      break;

    case error instanceof ZodError:
      status = 400;
      message = error.errors.map((err) => err.message).join(", ");
      break;

    default:
      status = 500;
      message = error.message;
      break;
  }

  res.status(status).json({ message });
}

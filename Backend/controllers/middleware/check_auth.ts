import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { HttpError } from "../../Models/CustomError";
import dotenv from "dotenv";
export const authorizationMiddleware = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.method === "OPTIONS") {
    return next();
  }
  if (!req.headers.authorization) {
    return next(new HttpError(401, "No token"));
  }
  try {
    const token = req.headers.authorization.split(" ")[1];
    if (!token) {
      return next(new HttpError(401, "No token"));
    }
    jwt.verify(token, process.env.TOKEN_KEY as string);
    return next();
  } catch (err) {
    const error = new HttpError(401, `Authentication Failed`);
    return next(err);
  }
};

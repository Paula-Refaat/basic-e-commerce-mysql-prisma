import { NextFunction, Request, Response } from "express";
import { UnauthorizeException } from "../exceptions/unauthorized-exception";
import * as jwt from "jsonwebtoken";
import { ErrorCode } from "../exceptions/root";
import { JWT_SECRET } from "../constants";
import { prismaClient } from "..";
const adminMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = req.user;
  if (user.role == "ADMIN") {
    next();
  } else {
    next(new UnauthorizeException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
};

export default adminMiddleware;

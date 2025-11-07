import { NextFunction, Request, Response } from "express";
import { UnauthorizeException } from "../exceptions/unauthorized-exception";
import * as jwt from "jsonwebtoken";
import { ErrorCode } from "../exceptions/root";
import { JWT_SECRET } from "../constants";
import { prismaClient } from "..";
const authMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  // 1. extract the token from header
  const token = req.headers.authorization;
  // 2. if the token not present, thew an error as unauthorized
  if (!token) {
    next(new UnauthorizeException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
  try {
    // 3. if the token is present, verify that token and extract the payload
    const payload = jwt.verify(token as string, JWT_SECRET) as any;

    // 4. to get the user from the payload
    const user = await prismaClient.user.findFirst({
      where: { id: payload.userId },
    });
    if (!user) {
      next(new UnauthorizeException("Unauthorized", ErrorCode.UNAUTHORIZED));
    }
    // 5. to attach the user to the current request
    req.user = user;
    next();
  } catch (error) {
    next(new UnauthorizeException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
};

export default authMiddleware;

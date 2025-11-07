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
  const token = req.headers.authorization;
  if (!token) {
    return next(
      new UnauthorizeException("Unauthorized", ErrorCode.UNAUTHORIZED)
    );
  }

  try {
    const payload = jwt.verify(token as string, JWT_SECRET) as any;

    const user = await prismaClient.user.findFirst({
      where: { id: payload.userId },
    });

    if (!user) {
      return next(
        new UnauthorizeException("Unauthorized", ErrorCode.UNAUTHORIZED)
      );
    }

    // attach the user to the request
    req.user = user;

    // ✅ لازم تنادي next() هنا
    next();
  } catch (error) {
    next(new UnauthorizeException("Unauthorized", ErrorCode.UNAUTHORIZED));
  }
};


export default authMiddleware;

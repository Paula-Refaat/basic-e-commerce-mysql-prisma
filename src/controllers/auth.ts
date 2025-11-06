import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { compareSync, hashSync } from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants";
import { BadRequestException } from "../exceptions/bad-request";
import { ErrorCode } from "../exceptions/root";
export const signup = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { name, email, password, phone, address } = req.body;
  let user = await prismaClient.user.findFirst({ where: { email } });
  if (user) {
    next(
      new BadRequestException(
        "User Already Exists",
        ErrorCode.USER_ALREADY_EXISTS
      )
    );
  }
  user = await prismaClient.user.create({
    data: {
      name,
      email,
      password: hashSync(password, 10),
      phone,
      address,
    },
  });
  res.json(user);
};

export const login = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body;
  let user = await prismaClient.user.findFirst({ where: { email } });
  if (!user) {
    throw new Error("User Not Found");
  }
  if (!compareSync(password, user.password)) {
    next(
      new BadRequestException(
        "Password is Incorrect",
        ErrorCode.INCORRECT_PASSWORD
      )
    );
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  res.json({ user, token });
};

import { Request, Response } from "express";
import { prismaClient } from "..";
import { compareSync, hashSync } from "bcryptjs";
import * as jwt from "jsonwebtoken";
import { JWT_SECRET } from "../constants";
export const signup = async (req: Request, res: Response) => {
  const { name, email, password, phone, address } = req.body;
  let user = await prismaClient.user.findFirst({ where: { email } });
  if (user) {
    throw new Error("Email already exists");
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

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;
  let user = await prismaClient.user.findFirst({ where: { email } });
  if (!user) {
    throw new Error("User Not Found");
  }
  if (!compareSync(password, user.password)) {
    throw new Error("Invalid Password");
  }
  const token = jwt.sign({ userId: user.id }, JWT_SECRET);
  res.json({ user, token });
};

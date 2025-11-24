import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { AddressSchema } from "../schema/users";
export const addAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  AddressSchema.parse(req.body);
  const address = await prismaClient.address.create({
    data: {
      ...req.body,
      userId: req.user.id,
    },
  });
  res.status(201).json(address);
};

export const deleteAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await prismaClient.address.delete({
      where: {
        id: req.params.id ? +req.params.id : 0,
      },
    });
    res.status(204).json();
  } catch (error) {
    throw new NotFoundException(
      "Address Not Found",
      ErrorCode.ADDRESS_NOT_FOUND
    );
  }
};

export const listAddress = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const address = await prismaClient.address.findMany({
    where: {
      userId: req.user.id,
    },
  });
  res.status(201).json(address);
};

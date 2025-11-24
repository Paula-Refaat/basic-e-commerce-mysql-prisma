import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { AddressSchema, UpdateUserSchema } from "../schema/users";
import { Address } from "@prisma/client";
import { BadRequestException } from "../exceptions/bad-request";
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

export const updateUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const validatedData = UpdateUserSchema.parse(req.body);
  let shippingAddress: Address;
  let billingAddress: Address;
  if (validatedData.defaultShippingAddress) {
    try {
      shippingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultShippingAddress
            ? validatedData.defaultShippingAddress
            : 0,
        },
      });
    } catch (error) {
      throw new NotFoundException(
        "Address Not Found",
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }
    if (shippingAddress.userId !== req.user.id) {
      throw new BadRequestException(
        "The Address not belong to this user",
        ErrorCode.ADDRESS_DOES_NOT_BELONG
      );
    }
  }

  if (validatedData.defaultBillingAddress) {
    try {
      billingAddress = await prismaClient.address.findFirstOrThrow({
        where: {
          id: validatedData.defaultBillingAddress
            ? validatedData.defaultBillingAddress
            : 0,
        },
      });
      if (billingAddress.userId !== req.user.id) {
        throw new BadRequestException(
          "The Address not belong to this user",
          ErrorCode.ADDRESS_DOES_NOT_BELONG
        );
      }
    } catch (error) {
      throw new NotFoundException(
        "Address Not Found",
        ErrorCode.ADDRESS_NOT_FOUND
      );
    }
  }

  const updatedUser = await prismaClient.user.update({
    where: { id: req.user.id! },
    data: validatedData,
  });

  res.status(200).json(updatedUser);
};

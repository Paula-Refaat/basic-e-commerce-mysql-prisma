import { Request, Response } from "express";
import { ChangeQuantitySchema, CreateCartSchema } from "../schema/cart";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
import { Product } from "@prisma/client";
import { prismaClient } from "..";

export const addItemToCart = async (req: Request, res: Response) => {
  const validatedData = CreateCartSchema.parse(req.body);
  let product: Product = await prismaClient.product.findFirstOrThrow({
    where: {
      id: validatedData.productId,
    },
  });
  try {
  } catch (error) {
    throw new NotFoundException(
      "Product Not Found",
      ErrorCode.PRODUCT_NOT_FOUND
    );
  }
  const cart = await prismaClient.cartItem.create({
    data: {
      userId: req.user.id,
      productId: product.id,
      quantity: req.body.quantity,
    },
  });
  res.json(cart);
};

export const deleteItemFromCart = async (req: Request, res: Response) => {
  await prismaClient.cartItem.delete({
    where: {
      id: req.params.id ? +req.params.id : 0,
    },
  });
  res.json({ message: "Item deleted" });
};

export const changeQuantity = async (req: Request, res: Response) => {
  const validatedData = ChangeQuantitySchema.parse(req.body);
  const updatedCart = await prismaClient.cartItem.update({
    where: {
      id: req.params.id ? +req.params.id : 0,
    },
    data: {
      quantity: validatedData.quantity,
    },
  });
  res.json(updatedCart);
};

export const getCarts = async (req: Request, res: Response) => {
  console.log("teeeeeeeeeeeeeeeeeeeeeeestsgsg ");
  const cart = await prismaClient.cartItem.findMany({
    where: {
      userId: req.user.id
    },

  });
  res.json(cart);
};

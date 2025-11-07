import { NextFunction, Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";
export const createProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const product = await prismaClient.product.create({
    data: {
      ...req.body,
      tags: req.body.tags.join(","),
    },
  });
  res.status(201).json(product);
};

export const updateProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const productData = req.body;
    if (productData.tags) {
      productData.tags = productData.tags.join(",");
    }
    const updatedProduct = await prismaClient.product.update({
      where: {
        id: req.params.id ? +req.params.id : 0,
      },
      data: {
        ...productData,
      },
    });
    res.json(updatedProduct);
  } catch (error) {
    throw new NotFoundException("product not found", ErrorCode.USER_NOT_FOUND);
  }
};

export const deleteProduct = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  await prismaClient.product.delete({
    where: {
      id: req.params.id ? +req.params.id : 0,
    },
  });
  res.status(204).json();
};

export const listProducts = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const products = await prismaClient.product.findMany({});
  res.status(201).json(products);
};

export const getProductById = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const product = await prismaClient.product.findUnique({
    where: {
      id: req.params.id ? +req.params.id : 0,
    },
  });
  res.status(201).json(product);
};

import { Request, Response } from "express";
import { prismaClient } from "..";
import { NotFoundException } from "../exceptions/not-found";
import { ErrorCode } from "../exceptions/root";

export const createOrder = async (req: Request, res: Response) => {
  return await prismaClient.$transaction(async (tx) => {
    const cartItems = await tx.cartItem.findMany({
      where: {
        id: req.user.id,
      },
      include: {
        product: true,
      },
    });
    if (cartItems.length == 0) {
      return res.json({ message: " Cart Is Empty" });
    }
    const price = cartItems.reduce((prev, current) => {
      return prev + current.quantity * +current.product.price;
    }, 0);

    const address = await tx.address.findFirst({
      where: {
        id: req.user.defaultShippingAddress,
      },
    });
    const order = await tx.order.create({
      data: {
        netAmount: price,
        address: address?.formattedAddress || "No Address Provided",
        userId: req.user.id,
        OrderProducts: {
          create: cartItems.map((item) => {
            return {
              productId: item.productId,
              quantity: item.quantity,
            };
          }),
        },
      },
    });
    const orderEvent = await tx.orderEvent.create({
      data: {
        orderId: order.id,
      },
    });
    await tx.cartItem.deleteMany({
      where: {
        userId: req.user.id,
      },
    });
    return res.json({ order });
  });
};

export const listOrders = async (req: Request, res: Response) => {
  const orders = await prismaClient.order.findMany({
    where: {
      userId: req.user.id,
    },
  });
  res.json(orders);
};

export const cancelOrder = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.update({
      where: {
        id: req.params.id ? +req.params.id : 0,
      },
      data: {
        status: "CANCELED",
      },
    });
    await prismaClient.orderEvent.create({
      data: {
        orderId: order.id,
        status: "CANCELED",
      },
    });
    res.json(order);
  } catch (error) {
    throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
  }
};

export const getOrderById = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.findFirstOrThrow({
      where: {
        id: req.params.id ? +req.params.id : 0,
      },
      include: {
        OrderProducts: true,
        OrderEvents: true,
      },
    });
    res.json(order);
  } catch (error) {
    throw new NotFoundException("Order not found", ErrorCode.ORDER_NOT_FOUND);
  }
};

export const listAllOrders = async (req: Request, res: Response) => {
  let whereClause = {};
  const status = req.query.status;
  if (status) {
    whereClause = {
      status,
    };
  }
  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip: req.query.skip ? +req.query.skip : 0,
    take: 5,
  });
  res.json(orders);
};

export const changeStatus = async (req: Request, res: Response) => {
  try {
    const order = await prismaClient.order.update({
      where: {
        id: req.params.id ? +req.params.id : 0,
      },
      data: {
        status: req.body.status,
      },
    });
    await prismaClient.orderEvent.create({
      data: {
        orderId: order.id,
        status: req.body.status,
      },
    });
    res.json(order);
  } catch (error) {
    throw new NotFoundException("Order not Found", ErrorCode.ORDER_NOT_FOUND);
  }
};

export const listUserOrders = async (req: Request, res: Response) => {
  let whereClause: any = {
    userId: req.params.id ? +req.params.id : 0,
  };
  const status = req.params.status;
  if (status) {
    whereClause = {
      ...whereClause,
      status,
    };
  }
  const orders = await prismaClient.order.findMany({
    where: whereClause,
    skip: req.query.skip ? +req.query.skip : 0,
    take: 5,
  });
  res.json(orders);
};

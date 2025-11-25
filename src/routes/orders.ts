import { listAddress } from "./../controllers/users";
import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";

import {
  cancelOrder,
  createOrder,
  getOrderById,
  listOrders,
} from "../controllers/orders";

const orderRoutes: Router = Router();

orderRoutes.post("/", [authMiddleware], errorHandler(createOrder));
orderRoutes.get("/", [authMiddleware], errorHandler(listOrders));
orderRoutes.get("/:id", [authMiddleware], errorHandler(getOrderById));
orderRoutes.put("/:id/cancel", [authMiddleware], errorHandler(cancelOrder));

export default orderRoutes;

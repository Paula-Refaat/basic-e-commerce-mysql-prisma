import { Router } from "express";
import authRoutes from "./auth";
import userRoutes from "./user";

import productRoutes from "./product";
import addressRoutes from "./address";
import cartRoutes from "./cart";
import orderRoutes from "./orders";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/user", userRoutes);

rootRouter.use("/product", productRoutes);
rootRouter.use("/address", addressRoutes);
rootRouter.use("/cart", cartRoutes);
rootRouter.use("/order", orderRoutes);

export default rootRouter;

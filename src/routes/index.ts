import { Router } from "express";
import authRoutes from "./auth";
import productRoutes from "./product";
import addressRoutes from "./users";
import cartRoutes from "./cart";

const rootRouter: Router = Router();

rootRouter.use("/auth", authRoutes);
rootRouter.use("/product", productRoutes);
rootRouter.use("/address", addressRoutes);
rootRouter.use("/cart", cartRoutes);

export default rootRouter;

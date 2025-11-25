import { listAddress } from "../controllers/users";
import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";

import adminMiddleware from "../middlewares/admin";
import { addAddress, deleteAddress, updateUser } from "../controllers/users";

const addressRoutes: Router = Router();

addressRoutes.post("/", [authMiddleware], errorHandler(addAddress));
addressRoutes.delete("/:id", [authMiddleware], errorHandler(deleteAddress));
addressRoutes.get("/", [authMiddleware], errorHandler(listAddress));
addressRoutes.put("/", [authMiddleware], errorHandler(updateUser));

export default addressRoutes;

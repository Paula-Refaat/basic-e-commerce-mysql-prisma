import { changeUserRole, getUserById, listUsers } from "../controllers/users";
import { Router } from "express";
import { errorHandler } from "../error-handler";
import authMiddleware from "../middlewares/auth";

import adminMiddleware from "../middlewares/admin";

const userRoutes: Router = Router();

userRoutes.get("/listAllUsers", [authMiddleware, adminMiddleware], errorHandler(listUsers));
userRoutes.get(
  "/:id/getById",
  [authMiddleware, adminMiddleware],
  errorHandler(getUserById)
);
userRoutes.put(
  "/:id/changeUserRole",
  [authMiddleware, adminMiddleware],
  errorHandler(changeUserRole)
);

export default userRoutes;

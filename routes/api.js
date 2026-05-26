import { Router } from "express";
import authMiddleware from "../Middleware/auth.middleware.js";
import AuthController from "../Controller/auth.controller.js";
import ProfileController from "../Controller/profile.controller.js";

const router = Router();

router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);

// Profile Routes

router.get("/user/get-profile", authMiddleware, ProfileController.getUsers);
router.put("/user/update-profile/:id", authMiddleware, ProfileController.updateUser);
router.delete("/user/delete-profile/:id", authMiddleware, ProfileController.deleteUser);


// list all the users
router.get("/user/list",authMiddleware,ProfileController.getUsers);

export default router;
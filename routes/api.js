import { Router } from "express";
import authMiddleware from "../Middleware/auth.middleware.js";
import AuthController from "../Controller/auth.controller.js";
import ProfileController from "../Controller/profile.controller.js";
import PostController from "../Controller/posts.controller.js"

const router = Router();

router.post("/auth/register", AuthController.register);
router.post("/auth/login", AuthController.login);

// Profile Routes

router.get("/user/get-profile/:id", authMiddleware, ProfileController.getUserDetails);
router.put("/user/update-profile/:id", authMiddleware, ProfileController.updateUser);
router.delete("/user/delete-profile/:id", authMiddleware, ProfileController.deleteUser);

// Post Routes
router.post("/post/create-post",authMiddleware,PostController.createPost);
router.get("/post/get-post-details/:id",authMiddleware,PostController.getPostDetails);
router.delete("/post/delete-post/:id",authMiddleware,PostController.deletePost);
router.put("/post/update-post/:id",authMiddleware,PostController.updatePost);
router.get("/post/get-all-post",authMiddleware,PostController.getAllPost);

export default router;
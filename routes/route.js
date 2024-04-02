//route.js

import express from "express";
import { authMiddleware } from "../middleware/auth-middleware.js";
import { getController } from "../controller/user-controller.js";
import {
  createPostController,
  deleteImagePostsController,
  getImagePostController,
  updatePostController,
} from "../controller/post-controller.js";

const router = new express.Router();

router.use(authMiddleware);
router.get("/current", getController);
router.post("/post", createPostController);
router.put("/post/update", updatePostController);
router.get("/post/getImage", getImagePostController);
router.delete("/post/deleteImage", deleteImagePostsController);

export default router;

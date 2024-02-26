// routes/publicRoute.js

import express from "express";
import {
  registerController,
  loginController,
  logoutController,
} from "../controller/user-controller.js";

import { getPostController } from "../controller/post-controller.js";

const publicRouter = new express.Router();

publicRouter.get("/", (req, res) => res.send("This is consign api running"));
publicRouter.post("/register", registerController);
publicRouter.post("/login", loginController);
publicRouter.post("/logout", logoutController);
publicRouter.get("/posts/all", getPostController);

export default publicRouter;

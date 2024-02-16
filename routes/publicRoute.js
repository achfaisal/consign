// routes/publicRoute.js

import express from "express";
import {
  registerController,
  loginController,
} from "../controller/user-controller.js";

const publicRouter = express.Router();

publicRouter.get("/", (req, res) => res.send("This is consign api running"));
publicRouter.post("/register", registerController);
publicRouter.post("/login", loginController);

export default publicRouter;

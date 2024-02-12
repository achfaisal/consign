// routes/publicRoute.js

import express from "express";
import registerController from "../controller/registerController.js";

const publicRouter = express.Router();

publicRouter.get("/", (req, res) => res.send("This is consign api running"));
publicRouter.post("/register", registerController); // Using the registerController directly

export default publicRouter;

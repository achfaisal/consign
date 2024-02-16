// controller/user-controller.js

import { registerHandler, loginHandler } from "../services/userHandler.js";

const registerController = async (req, res, next) => {
  try {
    const result = await registerHandler(req, res);
    res.status(200).json({
      message: "Registration successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const loginController = async (req, res, next) => {
  try {
    const result = await loginHandler(req, res);
    res.status(200).json({
      message: "Login success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export { registerController, loginController };

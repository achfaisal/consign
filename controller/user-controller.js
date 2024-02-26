// controller/user-controller.js

import {
  registerHandler,
  loginHandler,
  getHandler,
  logoutHandler,
} from "../services/user-handler.js";

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

const getController = async (req, res, next) => {
  try {
    const result = await getHandler(req, res);
    res.status(200).json({
      message: "Get user success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

const logoutController = async (req, res, next) => {
  try {
    const result = await logoutHandler(req, res);
    res.status(200).json({
      message: "Logout success",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export { registerController, loginController, getController, logoutController };

// controller/registerController.js

import registerHandler from "../services/registerHandler.js";

const registerController = async (req, res, next) => {
  try {
    const result = await registerHandler.registerHandler(req, res);
    res.status(200).json({
      message: "Registration successful",
      data: result,
    });
  } catch (error) {
    next(error);
  }
};

export default registerController;

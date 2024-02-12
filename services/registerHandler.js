// services/registerHandler.js

import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import registrationUserValidation from "../validation/user-validation.js";

const registerHandler = async (req, res) => {
  const request = await req.body;
  console.log(request);

  const validation = registrationUserValidation.validate(request);
  if (validation.error) {
    const error = validation.error.details.map((error) => error.message);
    throw new ResponseError(400, error);
  }
};

export default { registerHandler };

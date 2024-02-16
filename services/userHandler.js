// services/userHandler.js

import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import {
  registrationUserValidation,
  loginUserValidation,
} from "../validation/user-validation.js";
import { prismaClient } from "../application/database.js";

const registerHandler = async (req, res) => {
  const request = await req.body;

  const validatedRequest = registrationUserValidation.validate(request);
  if (validatedRequest.error) {
    const error = validatedRequest.error.details.map((error) => error.message);
    throw new ResponseError(400, error);
  }

  validatedRequest.value.password = await bcrypt.hash(
    validatedRequest.value.password,
    10
  );

  const countUser = await prismaClient.user.count({
    where: {
      username: validatedRequest.value.username,
    },
  });

  if (countUser === 1) {
    throw new ResponseError(400, "Username already exist!");
  }

  return await prismaClient.user.create({
    data: validatedRequest.value,
    select: {
      username: true,
      name: true,
    },
  });
};

const loginHandler = async (req, res) => {
  const request = await req.body;
  console.log(request);
  const validatedRequest = loginUserValidation.validate(request);
  if (validatedRequest.error) {
    const error = validatedRequest.error.details.map((error) => error.message);
    console.log(error);
    throw new ResponseError(400, error);
  }

  const checkUser = await prismaClient.user.findUnique({
    where: {
      username: validatedRequest.value.username,
    },
    select: {
      username: true,
      password: true,
    },
  });

  if (!checkUser) {
    throw new ResponseError(401, "Username or password wrong!");
  }

  const checkPassword = await bcrypt.compare(
    validatedRequest.value.password,
    checkUser.password
  );

  if (!checkPassword) {
    throw new ResponseError(401, "Pass not valid");
  }
};

export { registerHandler, loginHandler };

// services/userHandler.js

import { ResponseError } from "../error/response-error.js";
import bcrypt from "bcrypt";
import {
  registrationUserValidation,
  loginUserValidation,
  getUserValidation,
} from "../validation/user-validation.js";
import { prismaClient } from "../application/database.js";
import jwt from "jsonwebtoken";

const registerHandler = async (req, res) => {
  const request = req.body;

  const validatedRequest = registrationUserValidation.validate(request);
  if (validatedRequest.error) {
    const error = validatedRequest.error.details.map((error) => error.message);
    throw new ResponseError(400, error);
  }

  validatedRequest.value.password = await bcrypt.hash(
    validatedRequest.value.password,
    10,
  );

  console.log(validatedRequest);

  const countUser = await prismaClient.user.count({
    where: {
      username: validatedRequest.value.username,
    },
  });

  if (countUser === 1) {
    throw new ResponseError(400, "Username already exist!");
  }

  return prismaClient.user.create({
    data: validatedRequest.value,
    select: {
      username: true,
      name: true,
    },
  });
};

const loginHandler = async (req, res) => {
  const request = req.body;
  const validatedRequest = loginUserValidation.validate(request);
  if (validatedRequest.error) {
    const error = validatedRequest.error.details.map((error) => error.message);
    throw new ResponseError(400, error);
  }

  const checkUser = await prismaClient.user.findUnique({
    where: {
      username: validatedRequest.value.username,
    },
    select: {
      username: true,
      password: true,
      name: true,
    },
  });

  if (!checkUser) {
    throw new ResponseError(401, "Username or password wrong!");
  }

  const checkPassword = await bcrypt.compare(
    validatedRequest.value.password,
    checkUser.password,
  );

  if (!checkPassword) {
    throw new ResponseError(401, "Pass not valid");
  }
  const { username } = checkUser;
  const token = jwt.sign({ username: checkUser.username }, process.env.SECRET, {
    expiresIn: "1d",
  });

  res.cookie("jwt", token, { httpOnly: true, path: "/" });

  // const refreshToken = jwt.sign(
  //   { username: checkUser.username },
  //   process.env.SECRET_REFRESH,
  //   {
  //     expiresIn: "3d",
  //   }
  // );

  return { token };
};

const getHandler = async (req, res) => {
  const request = req.body.username;
  const validatedRequest = getUserValidation.validate(request);

  const user = await prismaClient.user.findUnique({
    where: {
      username: validatedRequest.value,
    },
    select: {
      username: true,
      name: true,
      phone: true,
    },
  });

  if (!user) {
    throw new ResponseError(404, "User is not found");
  }
  return user;
};

const logoutHandler = async (req, res) => {
  res.clearCookie("jwt", { httpOnly: true, path: "/" });
  console.log("cookie cleared");
};

export { registerHandler, loginHandler, getHandler, logoutHandler };

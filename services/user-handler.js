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
    10
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

  const token = jwt.sign({ username: checkUser.username }, process.env.SECRET, {
    expiresIn: "5s",
  });

  const refreshToken = jwt.sign(
    { username: checkUser.username },
    process.env.SECRET_REFRESH,
    {
      expiresIn: "3d",
    }
  );

  res.cookie("token", token, {
    httpOnly: true, // Prevents client-side JavaScript from accessing the cookie
    secure: true, // Ensures the cookie is only sent over HTTPS
    sameSite: "None", // Allows the cookie to be sent in a cross-origin request
  });

  res.cookie("refreshToken", refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: "None",
  });
  return { token, refreshToken };
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
    },
  });

  if (!user) {
    throw new ResponseError(404, "User is not found");
  }
  return user;
};

const logoutHandler = async (req, res) => {
  res.cookie("token", "", {
    expires: new Date(0),
    maxAge: 0,
  });

  // Clear the refreshToken cookie
  res.cookie("refreshToken", "", {
    expires: new Date(0),
    maxAge: 0,
  });
};

export { registerHandler, loginHandler, getHandler, logoutHandler };

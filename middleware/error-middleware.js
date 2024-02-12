// middleware/error-middleware.js

import { ResponseError } from "../error/response-error.js";

const errorMiddleware = (err, req, res, next) => {
  if (!err) {
    next();
    return;
  }

  if (err instanceof ResponseError) {
    res.status(err.status).json({
      error: err.message,
    });
  } else {
    res.status(500).json({
      error: "Internal Server Error",
    });
  }
};

export { errorMiddleware };

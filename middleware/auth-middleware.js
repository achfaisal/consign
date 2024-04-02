import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.jwt;
  if (token) {
    try {
      const verifyToken = jwt.verify(token, process.env.SECRET);
      req.body.username = verifyToken.username;
      next();
    } catch (error) {
      res.status(401).json({
        message: "Token not valid",
      });
    }
  } else {
    res.status(401).json({
      message: "No token provided",
    });
  }
};

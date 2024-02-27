import jwt from "jsonwebtoken";

export const authMiddleware = async (req, res, next) => {
  const token = req.cookies.token;
  const refreshToken = req.cookies.refreshToken;

  if (!token && !refreshToken) {
    return res.status(401).json({
      message: "No token provided",
    });
  }

  jwt.verify(token, process.env.SECRET, (err, decoded) => {
    if (err) {
      if (err.name === "TokenExpiredError" && refreshToken) {
        jwt.verify(
          refreshToken,
          process.env.SECRET_REFRESH,
          async (err, decodedRefresh) => {
            if (err) {
              return res.status(401).json({
                message: "Refresh token not valid",
              });
            }

            const newToken = jwt.sign(
              { username: decodedRefresh.username },
              process.env.SECRET,
              { expiresIn: "5s" }
            );
            res.cookie("token", newToken, {
              httpOnly: true,
              secure: true,
              sameSite: "None",
              expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
            });
            req.body.username = decodedRefresh.username;
            return next();
          }
        );
      } else {
        return res.status(401).json({
          message: err,
        });
      }
    } else {
      req.body.username = decoded.username;
      return next();
    }
  });
};

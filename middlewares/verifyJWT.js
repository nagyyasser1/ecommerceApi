const jwt = require("jsonwebtoken");
const STATUS_CODES = require("../constants/STATUS_CODES");

const verifyJWT = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err)
      return res.status(STATUS_CODES.FORBIDDEN).json({ message: "Forbidden" });
    req.user = decoded;
    next();
  });
};

module.exports = verifyJWT;

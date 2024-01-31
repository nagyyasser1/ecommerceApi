import pkg from 'jsonwebtoken';
const { verify } = pkg;
import STATUS_CODES from "../constants/STATUS_CODES.js";
const { UNAUTHORIZED, FORBIDDEN } = STATUS_CODES;

const isAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization || req.headers.Authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return res
      .status(UNAUTHORIZED)
      .json({ message: "Unauthorized" });
  }

  const token = authHeader.split(" ")[1];

  verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err)
      return res.status(FORBIDDEN).json({ message: "Forbidden" });

    if (decoded?.isAdmin === false) {
      return res
        .status(UNAUTHORIZED)
        .json({ message: "Unauthorized!" });
    }
    req.user = decoded;
    next();
  });
};

export default isAdmin;

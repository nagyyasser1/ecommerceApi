import STATUS_CODES from "../constants/STATUS_CODES.js";

const filesPayloadExists = (req, res, next) => {
  if (!req.files)
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ status: "error", message: "missing files!" });
  next();
};

export default filesPayloadExists;

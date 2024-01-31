import { sequelize } from "../models/index.js";
import { compare } from "bcrypt";
import pkg from 'jsonwebtoken';
const { sign, verify } = pkg;
import asyncHandler from "express-async-handler";
import STATUS_CODES from "../constants/STATUS_CODES.js";
const { UNAUTHORIZED, NOT_FOUND, BAD_REQUEST, FORBIDDEN, NO_CONTENT } = STATUS_CODES;

// @desc Login
// @route POST /auth
// @access Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(UNAUTHORIZED)
      .json({ message: "All fields are required! {email , password}" });
  }

  // Check for existence email
  const foundUser = await sequelize.models.User.findOne({
    where: {
      email: email,
    },
  });

  if (!foundUser) {
    return res
      .status(NOT_FOUND)
      .json({ message: "email or password incorrect!" });
  }

  const match = await compare(password, foundUser.password);

  if (!match)
    return res
      .status(BAD_REQUEST)
      .json({ message: "email or password incorrect!" });

  const accessToken = sign(
    {
      username: foundUser.username,
      email: foundUser.email,
      id: foundUser.id,
      isAdmin: foundUser.isAdmin,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1h" }
  );

  const refreshToken = sign(
    {
      username: foundUser.username,
      email: foundUser.email,
      id: foundUser.id,
      isAdmin: foundUser.isAdmin,
    },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: "7d" }
  );

  // Create secure cookie with refresh token
  res.cookie("jwt", refreshToken, {
    httpOnly: true, //accessible only by web server
    secure: process.env.NODE_ENV === "production", //https
    sameSite: "None", //cross-site cookie
    maxAge: 7 * 24 * 60 * 60 * 1000, //cookie expiry: set to match rT
  });

  // Send accessToken containing username , email , id
  res.json({ accessToken });
});

// @desc Refresh
// @route GET /auth/refresh
// @access Public -
const refresh = (req, res) => {
  const cookies = req.cookies;

  if (!cookies?.jwt)
    return res
      .status(UNAUTHORIZED)
      .json({ message: "Unauthorized" });

  const refreshToken = cookies.jwt;

  verify(
    refreshToken,
    process.env.REFRESH_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err)
        return res
          .status(FORBIDDEN)
          .json({ message: "Forbidden" });

      const foundUser = await sequelize.models.User.findOne({
        where: {
          email: decoded.email,
        },
      });

      if (!foundUser)
        return res
          .status(UNAUTHORIZED)
          .json({ message: "Unauthorized" });

      const accessToken = sign(
        {
          username: foundUser.username,
          email: foundUser.email,
          id: foundUser.id,
          isAdmin: foundUser.isAdmin,
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: "1h" }
      );

      res.json({ accessToken });
    })
  );
};

// @desc Logout
// @route POST /auth/logout
// @access Public
const logout = (req, res) => {
  const cookies = req.cookies;
  if (!cookies?.jwt) return res.sendStatus(NO_CONTENT); //No content
  res.clearCookie("jwt", { httpOnly: true, sameSite: "None", secure: process.env.NODE_ENV });
  res.json({ message: "Cookie cleared" });
};

export  {
  login,
  refresh,
  logout,
};

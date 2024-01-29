const db = require("../models");
const asyncHandler = require("express-async-handler");
const STATUS_CODES = require("../constants/STATUS_CODES");
const transporter = require("../config/transporter");
const jwt = require("jsonwebtoken");

// @desc Get all users
// @route GET /users
// @access Private
const getAllUsers = asyncHandler(async (req, res) => {
  // Get all users from DB
  const users = await db.User.findAll({
    attributes: {
      exclude: ["password"], // Excludes the 'password' field from the retrieved data
    },
  });

  // If no users
  if (!users?.length) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ message: "No users found" });
  }

  res.json(users);
});

// @desc Get user by id
// @route GET /users/:id
// @access Private
const getUserById = asyncHandler(async (req, res) => {
  const userId = req.params.userId;

  const user = await db.User.findOne({
    where: {
      id: userId,
    },
    attributes: {
      exclude: ["password"],
    },
    include: [
      {
        model: db.ShippingAddress,
        as: "ShippingAddresses", // Use the alias defined in the ShippingAddress association
        attributes: { exclude: ["createdAt", "updatedAt"] }, // Exclude unnecessary fields
      },
      {
        model: db.Review,
        as: "Reviews", // Use the alias defined in the ShippingAddress association
        attributes: { exclude: ["createdAt", "updatedAt"] }, // Exclude unnecessary fields
      },
    ],
  });

  // If no user
  if (!user) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ message: "No user found" });
  }

  if (req.user.isAdmin) {
    return res.status(STATUS_CODES.SUCCESS).send(user);
  }

  // check for Identity
  if (user.dataValues.id !== req.user.id) {
    return res
      .status(STATUS_CODES.UNAUTHORIZED)
      .json({ message: "Unauthorized!" });
  }

  res.json(user);
});

// @desc Create new user
// @route POST /users
// @access Public
const createNewUser = asyncHandler(async (req, res) => {
  const { email, firstName, lastName, address, phone, password } = req.body;

  // Confirm data
  if (!password || !email || !phone || !firstName || !lastName || !address) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ message: "All fields are required! {email,firstName,lastName,address,phone,password}" });
  }

  // Check for duplicate username
  const duplicate = await db.User.findOne({
    where: {
      email: email,
    },
  });

  if (duplicate) {
    return res
      .status(STATUS_CODES.CONFLICT)
      .json({ message: "Duplicate username" });
  }

  const newUser = db.User.build({
    email,
    firstName,
    lastName,
    address,
    phone,
    password,
  });

  // Create and store new user
  await newUser.save();

  if (newUser) { //created
    res
      .status(STATUS_CODES.SUCCESS)
      .json(newUser);
  } else {
    res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ message: "Invalid user data received" });
  }
});

// @desc Update a user
// @route PATCH /users
// @access Private
const makeUserAdmin = asyncHandler(async (req, res) => {
  const { userId, isAdmin } = req.body;

  try {
    if (typeof isAdmin !== "boolean") {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "isAdmin must be of type boolean." });
    }
    // Find the user by ID
    const user = await db.User.findByPk(userId);

    // If no user found
    if (!user) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: "User not found" });
    }

    // Update user role
    user.isAdmin = isAdmin;

    // Save the updated user
    await user.save();

    return res
      .status(STATUS_CODES.SUCCESS)
      .json({ message: "User updated successfully", user });
  } catch (error) {
    console.error("Error updating user:", error);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

// @desc Delete a user
// @route DELETE /users
// @access Private
const deleteUser = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  try {
    // Check if the user exists
    const user = await db.User.findByPk(userId);

    if (!user) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: "User not found" });
    }

    // Delete the user
    await user.destroy();

    return res
      .status(STATUS_CODES.SUCCESS)
      .json({ message: "User deleted successfully" });
  } catch (error) {
    console.error("Error deleting user:", error);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

const sendEmailVerification = asyncHandler(async (req, res) => {
  const { email } = req.body;

  // Generate a unique token for email verification
  const verificationToken = jwt.sign(
    {
      email,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: "1d" }
  );

  const mailOptions = {
    from: process.env.MY_EMAIL,
    to: email,
    subject: "Email Verification",
    text: `Click the following link to verify your email: http://localhost:3000/api/user/verify-email/${verificationToken}`,
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error("Error sending email:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }

    console.log("Email sent:", info.response);
    res.status(200).json({ message: "Verification email sent successfully" });
  });
});

const verifyEmail = asyncHandler(async (req, res) => {
  const token = req.params.token;
  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    asyncHandler(async (err, decoded) => {
      if (err)
        return res
          .status(STATUS_CODES.FORBIDDEN)
          .json({ message: "Forbidden" });

      const foundUser = await db.User.findOne({
        where: {
          email: decoded.email,
        },
      });

      if (!foundUser)
        return res
          .status(STATUS_CODES.UNAUTHORIZED)
          .json({ message: "Unauthorized" });

      foundUser.verified = true;
      await foundUser.save();
      res.send(foundUser);
    })
  );
});

module.exports = {
  getAllUsers,
  createNewUser,
  makeUserAdmin,
  deleteUser,
  getUserById,
  sendEmailVerification,
  verifyEmail,
};

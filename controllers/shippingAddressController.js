const asyncHandler = require("express-async-handler");
const db = require("../models");
const STATUS_CODES = require("../utils/STATUS_CODES");

// @desc Add ShippingAddress
// @route /shippingaddress
// @access Public
const addShippingAddress = asyncHandler(async (req, res) => {
  const { streetAddress, city, state, zipCode, country, isDefault } = req.body;

  console.log(req.user);
  if (
    !streetAddress ||
    !city ||
    !state ||
    !zipCode ||
    !country ||
    isDefault === undefined
  ) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ message: "All fields are required!" });
  }

  try {
    // Create a new shipping address
    const newShippingAddress = await db.ShippingAddress.create({
      streetAddress,
      city,
      state,
      zipCode,
      country,
      isDefault,
      userId: req.user.id,
    });

    return res.status(STATUS_CODES.CREATED).json({
      message: "Shipping address added successfully",
      shippingAddress: newShippingAddress,
    });
  } catch (error) {
    console.error("Error adding new shipping address:", error);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

module.exports = {
  addShippingAddress,
};

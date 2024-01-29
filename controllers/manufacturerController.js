const db = require("../models");
const STATUS_CODES = require("../utils/STATUS_CODES");
const asyncHandler = require("express-async-handler");

const addManufacturer = asyncHandler(async (req, res) => {
  const { manufacturerName, description } = req.body;

  if (!manufacturerName || !description) {
    return res
      .status(STATUS_CODES.BAD_REQUEST)
      .json({ message: "All fields required!" });
  }

  try {
    // Check if the manufacturer already exists
    const existingManufacturer = await db.Manufacturer.findOne({
      where: {
        manufacturerName,
      },
    });

    if (existingManufacturer) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "Manufacturer already exists!" });
    }

    // Create a new manufacturer
    const newManufacturer = await db.Manufacturer.create({
      manufacturerName,
      description,
    });

    return res.status(STATUS_CODES.CREATED).json({
      message: "Manufacturer added successfully",
      manufacturer: newManufacturer,
    });
  } catch (error) {
    console.error("Error adding manufacturer:", error);
    return res
      .status(STATUS_CODES.INTERNAL_SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

const getManufacturer = asyncHandler(async (req, res) => {
  try {
    const manufacturers = await db.Manufacturer.findAll();

    return res.status(STATUS_CODES.SUCCESS).json({
      message: "Manufacturers retrieved successfully",
      manufacturers,
    });
  } catch (error) {
    console.error("Error getting all manufacturers:", error);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

const deleteManufacturer = asyncHandler(async (req, res) => {
  try {
    const { manufacturerId } = req.body;
    if (!manufacturerId) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "provide manufacturerId" });
    }
    await db.Manufacturer.destroy({
      where: {
        id: manufacturerId,
      },
    });
    return res.status(STATUS_CODES.SUCCESS).json({
      message: `Manufacturer with id : ${manufacturerId} deleted successfully`,
    });
  } catch (error) {
    console.error("Error delteing a manufacturer:", error);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});
module.exports = {
  addManufacturer,
  getManufacturer,
  deleteManufacturer,
};

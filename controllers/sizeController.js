import asyncHandler from "express-async-handler";
import { sequelize } from "../models/index.js";
import STATUS_CODES from "../constants/STATUS_CODES.js";
const  { BAD_REQUEST, CREATED, SERVER_ERROR, NOT_FOUND, NO_CONTENT, SUCCESS } = STATUS_CODES;

// @desc Add new Size
// @route /size
// @access Private
const addSize = asyncHandler(async (req, res) => {
  const { type } = req.body;

  try {
    // Check if the size already exists
    const existingSize = await sequelize.models.Size.findOne({
      where: {
        type,
      },
    });

    if (existingSize) {
      return res
        .status(BAD_REQUEST)
        .json({ message: `Size: ${type} already exists!` });
    }

    // Create a new size
    const newSize = await sequelize.models.Size.create({
      type,
    });

    return res
      .status(CREATED)
      .json(newSize);
  } catch (error) {
    console.error("Error adding size:", error);
    return res
      .status(SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

// @desc Delete a spacific Size
// @route GET /size/:sizeId
// @access Private
const deleteSize = asyncHandler(async (req, res) => {
  const sizeId = req.body.sizeId;

  try {
    // Check if the size exists
    const sizeToDelete = await sequelize.models.Size.findByPk(sizeId);

    if (!sizeToDelete) {
      return res
        .status(NOT_FOUND)
        .json({ message: "Size not found" });
    }

    // Delete the size
    await sizeToDelete.destroy();

    return res.status(NO_CONTENT).send();
  } catch (error) {
    console.error("Error deleting category:", error);
    return res
      .status(SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

// @desc get all Size
// @route GET /Size
// @access Private
const getAllSizes = asyncHandler(async (req, res) => {
  try {
    const sizes = await sequelize.models.Size.findAll();

    return res.status(SUCCESS).send(sizes);
  } catch (error) {
    console.error("Error getting all sizes:", error);
    return res
      .status(SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

// @desc update size
// @route patch /Size
// @access Private
const updateSize = asyncHandler(async (req, res) => {
  const { type } = req.body;
  const { sizeId } = req.params;

  try {
    // Check if the size exists
    const size = await sequelize.models.Size.findByPk(sizeId);

    if (!size) {
      return res.status(NOT_FOUND).json({
        message: "size not found.",
      });
    }

    // Update size properties
    size.type = type || size.type;

    // Save the updated size
    await size.save();

    return res.status(SUCCESS).send(size);
  } catch (error) {
    console.error("Error updating size:", error);
    return res.status(SERVER_ERROR).json({
      message: "Internal Server Error",
    });
  }
});

export  {
  addSize,
  deleteSize,
  getAllSizes,
  updateSize,
};

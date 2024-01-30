const asyncHandler = require("express-async-handler");
const { sequelize } = require("../models");
const STATUS_CODES = require("../constants/STATUS_CODES");

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
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: `Size: ${type} already exists!` });
    }

    // Create a new size
    const newSize = await sequelize.models.Size.create({
      type,
    });

    return res
      .status(STATUS_CODES.CREATED)
      .json(newSize);
  } catch (error) {
    console.error("Error adding size:", error);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
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
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: "Size not found" });
    }

    // Delete the size
    await sizeToDelete.destroy();

    return res.status(STATUS_CODES.NO_CONTENT).send();
  } catch (error) {
    console.error("Error deleting category:", error);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

// @desc get all Size
// @route GET /Size
// @access Private
const getAllSizes = asyncHandler(async (req, res) => {
  try {
    const sizes = await sequelize.models.Size.findAll();

    return res.status(STATUS_CODES.SUCCESS).send(sizes);
  } catch (error) {
    console.error("Error getting all sizes:", error);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
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
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: "size not found.",
      });
    }

    // Update size properties
    size.type = type || size.type;

    // Save the updated size
    await size.save();

    return res.status(STATUS_CODES.SUCCESS).send(size);
  } catch (error) {
    console.error("Error updating size:", error);
    return res.status(STATUS_CODES.SERVER_ERROR).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = {
  addSize,
  deleteSize,
  getAllSizes,
  updateSize,
};

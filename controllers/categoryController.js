const asyncHandler = require("express-async-handler");
const { sequelize } = require("../models");
const STATUS_CODES = require("../constants/STATUS_CODES");

// @desc Add new Category
// @route /category
// @access Private
const addCategory = asyncHandler(async (req, res) => {
  const { categoryName, description } = req.body;

  try {
    // Check if the category already exists
    const existingCategory = await sequelize.models.Category.findOne({
      where: {
        categoryName,
      },
    });

    if (existingCategory) {
      return res
        .status(STATUS_CODES.BAD_REQUEST)
        .json({ message: "Category already exists!" });
    }

    // Create a new category
    const newCategory = await sequelize.models.Category.create({
      categoryName,
      description,
    });

    return res
      .status(STATUS_CODES.CREATED)
      .json(newCategory);
  } catch (error) {
    console.error("Error adding category:", error);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

// @desc Delete a spacific Category
// @route GET /category/:categoryId
// @access Private
const deleteCategory = asyncHandler(async (req, res) => {
  const categoryId = req.body.categoryId;

  try {
    // Check if the category exists
    const categoryToDelete = await sequelize.models.Category.findByPk(categoryId);

    if (!categoryToDelete) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: "Category not found" });
    }

    // Delete the category
    await categoryToDelete.destroy();

    return res.status(STATUS_CODES.NO_CONTENT).send();
  } catch (error) {
    console.error("Error deleting category:", error);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

// @desc get all Category
// @route GET /category
// @access Private
const getAllCategories = asyncHandler(async (req, res) => {
  try {
    const categories = await sequelize.models.Category.findAll();

    return res.status(STATUS_CODES.SUCCESS).send(categories);
  } catch (error) {
    console.error("Error getting all categories:", error);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

const updateCategory = asyncHandler(async (req, res) => {
  const { categoryName, description, categoryId } = req.body;

  try {
    // Check if the category exists
    const category = await sequelize.models.Category.finsequelize.modelsyPk(categoryId);

    if (!category) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: "Category not found.",
      });
    }

    // Update category properties
    category.categoryName = categoryName || category.categoryName;
    category.description = description || category.description;

    // Save the updated category
    await category.save();

    return res.status(STATUS_CODES.SUCCESS).json({
      message: "Category updated successfully.",
      category,
    });
  } catch (error) {
    console.error("Error updating category:", error);
    return res.status(STATUS_CODES.SERVER_ERROR).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = {
  addCategory,
  deleteCategory,
  getAllCategories,
  updateCategory,
};

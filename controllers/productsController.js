const db = require("../models");
const asyncHandler = require("express-async-handler");
const STATUS_CODES = require("../constants/STATUS_CODES");
const deleteFile = require("../utils/deleteFile");
const path = require("path");
const { validateProductData, sizesExists, categoryExists } = require("../utils/validations/product.validations");

// @desc Add New product
// @route /product
// @access Privit
const addProduct = asyncHandler(async (req, res, next) => {

  const result = validateProductData(req.body);

  if (result.error) {
    return res.status(STATUS_CODES.BAD_REQUEST).send(result.error);
  }

  const {
    name,
    description,
    categoryId,
    price,
    isFeatured,
    sizes
  } = req.body;

  try {

    // Check If The Specified Category Exists
    const categoryResult = categoryExists(categoryId);

    if (categoryResult.error) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .send(categoryResult.error);
    }

    // Check If The Specified Sizes Exists
    const sizesResult = sizesExists(sizes);

    if (sizesResult.error) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .send(sizesExists.error);
    }

    //Create New Product
    const newProduct = await db.Product.create({
      name,
      description,
      price,
      isFeatured,
      categoryId,
    });

    req.newProduct = newProduct;
    next();
  } catch (error) {
    console.error("Error adding new product:", error);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: "Internal Server Error", error });
  }
});

// @desc saves files about product
// @route /product
// @access Privit
const saveFiles = asyncHandler(async (req, res) => {
  try {
    const files = req.files;
    const product = req.newProduct;
    const { id: productId } = product;

    const promises = Object.keys(files).map(async (key) => {
      const filepath = path.join(
        __dirname,
        "../uploads",
        productId + files[key].name
      );

      return new Promise((resolve, reject) => {
        files[key].mv(filepath, async (err) => {
          if (err) {
            console.error(`Error saving file ${files[key].name}:`, err);
            reject({ file: files[key].name, error: err });
          } else {
            await db.ProductImage.create({
              imageUrl: productId + files[key].name,
              productId,
            });
            resolve();
          }
        });
      });
    });

    await Promise.all(promises);

    return res
      .status(STATUS_CODES.CREATED)
      .json(product);

  } catch (error) {

    // Destroy product if can't save files
    await db.Product.destroy({
      where: {
        id: req.newProduct.id,
      },
    });

    console.error("Error saving files:", error);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: "Error saving files", error });
  }
});

// @desc Get all products
// @route /product
// @access Public
const getAllProducts = asyncHandler(async (req, res) => {
  try {
    // Get page and pageSize from the request query, default to 1 and 10 if not provided
    const page = parseInt(req.query.page) || 1;
    const pageSize = parseInt(req.query.pageSize) || 10;
    const categoryId = parseInt(req.query.categoryId);
    const searchQuery = req.query.searchQuery;

    // Calculate the offset based on the page and pageSize
    const offset = (page - 1) * pageSize;

    // Define the where condition based on stockQuantity, categoryId, and searchQuery
    const whereCondition = {
      stockQuantity: {
        [db.Sequelize.Op.gt]: 0, // Filter for stockQuantity greater than 0
      },
    };

    if (categoryId) {
      whereCondition.categoryId = categoryId;
    }

    if (searchQuery) {
      // Add condition to search for products with names containing the searchQuery
      whereCondition.name = {
        [db.Sequelize.Op.like]: `%${searchQuery}%`,
      };
    }

    // Get all products with pagination and include associated fields (category, manufacturer, and reviews)
    const products = await db.Product.findAll({
      attributes: {
        exclude: ["categoryId", "manufacturerId", "createdAt", "updatedAt"],
      },
      include: [
        {
          model: db.ProductImage,
          as: "ProductImages",
          attributes: {
            exclude: ["id", "createdAt", "updatedAt", "productId"],
          },
        },
      ],
      where: whereCondition,
      offset,
      limit: pageSize,
    });

    return res.status(STATUS_CODES.SUCCESS).json({ products });
  } catch (error) {
    console.error("Error getting all products:", error);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

// @desc Get one product
// @route /product/:productId
// @access Public
const getProductById = asyncHandler(async (req, res) => {
  const productId = req.params.productId;

  try {
    // Find the product by ID
    const product = await db.Product.findByPk(productId, {
      include: [
        {
          model: db.Category,
          as: "Category",
        },
        {
          model: db.Manufacturer,
          as: "Manufacturer",
        },
        {
          model: db.Review,
          as: "Reviews",
        },
        { model: db.ProductImage, as: "ProductImages" },
      ],
    });

    // Check if the product exists
    if (!product) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: "Product not found",
      });
    }

    return res.status(STATUS_CODES.SUCCESS).send(product);
  } catch (error) {
    console.error("Error getting product by ID:", error);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

// @desc update product basic info
// @route /product/:productId
// @access Privite
const updateProduct = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const { name, description, price, stockQuantity, isFeatured } = req.body;

  try {
    // Find the product by ID
    const product = await db.Product.findByPk(productId);

    // If the product doesn't exist
    if (!product) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: "Product not found" });
    }

    // Update the product details
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stockQuantity = stockQuantity || product.stockQuantity;
    product.isFeatured = isFeatured || product.isFeatured;

    // Save the updated product
    await product.save();

    res
      .status(STATUS_CODES.SUCCESS)
      .json({ message: "Product updated successfully", product });
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

// @desc delete product
// @route /product/:productId
// @access Privite
const deleteProduct = asyncHandler(async (req, res) => {
  const productId = req.params.productId;

  try {
    // Find the product by ID
    const product = await db.Product.findByPk(productId);

    // If the product doesn't exist
    if (!product) {
      return res
        .status(STATUS_CODES.NOT_FOUND)
        .json({ message: "Product not found" });
    }

    // Delete associated images in ProductImage table
    const productImages = await db.ProductImage.findAll({
      where: {
        productId: product.id,
      },
    });

    // Define a function to delete an image file
    const deleteImageFile = async (image) => {
      await deleteFile(image.imageUrl);
    };

    // Loop through productImages and delete associated files
    await Promise.all(productImages.map(deleteImageFile));

    // Delete the product
    await db.ProductImage.destroy({
      where: {
        productId,
      },
    });
    await product.destroy();

    res
      .status(STATUS_CODES.SUCCESS)
      .json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

// @desc get featured product
// @route /products/featured
// @access Public
const getAllFeaturedProducts = asyncHandler(async (req, res) => {
  try {
    const products = await db.Product.findAll({
      where: {
        isFeatured: true,
      },
      include: [
        { model: db.Category, as: "Category" },
        { model: db.Manufacturer, as: "Manufacturer" },
        { model: db.Review, as: "Reviews" },
        { model: db.ProductImage, as: "ProductImages" },
      ],
    });

    return res.status(STATUS_CODES.SUCCESS).json({ products });
  } catch (error) {
    console.error("Error getting all products:", error);
    return res
      .status(STATUS_CODES.SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

module.exports = {
  addProduct,
  getAllProducts,
  getProductById,
  saveFiles,
  updateProduct,
  deleteProduct,
  getAllFeaturedProducts,
};

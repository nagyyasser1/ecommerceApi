import { sequelize } from "../models/index.js";
import asyncHandler from "express-async-handler";
import STATUS_CODES from "../constants/STATUS_CODES.js";
import deleteFile from "../utils/deleteFile.js";
import { categoryExists, sizesExist } from "../utils/validations/product.validations.js";

const { NOT_FOUND, SERVER_ERROR, CREATED, SUCCESS } = STATUS_CODES;

import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// @desc Add New product
// @route /product
// @access Privit
const addProduct = asyncHandler(async (req, res, next) => {

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
    const categoryResult = await categoryExists(categoryId);

    if (!categoryResult.isValid) {
      return res
        .status(NOT_FOUND)
        .send(categoryResult.error);
    }

    // Check If The Specified Sizes Exists
    const sizesResult = await sizesExist(sizes);

    if (!sizesResult.isValid) {
      return res
        .status(NOT_FOUND)
        .send(sizesResult.error);
    }

    //Create New Product
    const newProduct = await sequelize.models.Product.create({
      name,
      description,
      price,
      isFeatured,
      CategoryId: categoryId,
    });

    for (let i = 0; i < sizes.length; i++) {
      await sequelize.models.ProductSize.create({
        SizeId: sizes[i].sizeId,
        ProductId: newProduct.id,
        color: sizes[i].color,
        quantity: sizes[i].quantity
      })
    }

    req.newProduct = newProduct;
    next();
  } catch (error) {
    console.error("Error adding new product:", error);
    return res
      .status(SERVER_ERROR)
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
      const filepath = join(
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
            await sequelize.models.ProductImage.create({
              imageUrl: productId + files[key].name,
              ProductId: productId,
            });
            resolve();
          }
        });
      });
    });

    await Promise.all(promises);

    return res
      .status(CREATED)
      .send(product);

  } catch (error) {

    // Destroy product if can't save files
    await sequelize.models.Product.destroy({
      where: {
        id: req.newProduct.id,
      },
    });

    console.error("Error saving files:", error);
    return res
      .status(SERVER_ERROR)
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

    // Define the where condition based on  categoryId, and searchQuery
    const whereCondition = {};

    if (categoryId) {
      whereCondition.CategoryId = categoryId;
    }

    // Add condition to search for products with names containing the searchQuery
    if (searchQuery) {
      whereCondition.name = {
        [sequelize.Sequelize.Op.like]: `%${searchQuery}%`,
      };
    }

    // Get all products with pagination and include associated fields (category, manufacturer, and reviews)
    const products = await sequelize.models.Product.findAll({
      attributes: {
        exclude: ["CategoryId", "createdAt", "updatedAt"],
      },
      include: [
        {
          model: sequelize.models.ProductImage,
          as: "ProductImages",
          attributes: {
            exclude: ["id", "createdAt", "updatedAt", "productId"],
          },
        },
        {
          model: sequelize.models.Category,
          as: "Category",
          attributes: {
            exclude: ["createdAt", "updatedAt"]
          }
        },
      ],
      where: whereCondition,
      offset,
      limit: pageSize,
    });

    const modifiedProducts = products.map(p => {
      return {
        id: p.id,
        name: p.name,
        description: p.description,
        price: p.price,
        featured: p.isFeatured,
        category: p.Category.categoryName,
        images: p.ProductImages.map(img => img.imageUrl),
      }
    })

    return res.status(SUCCESS).json(modifiedProducts);
  } catch (error) {
    console.error("Error getting all products:", error);
    return res
      .status(SERVER_ERROR)
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
    const product = await sequelize.models.Product.findByPk(productId, {
      include: [
        {
          model: sequelize.models.Category,
          as: "Category",
          attributes: {
            exclude: ["createdAt", "updatedAt"]
          }
        },
        {
          model: sequelize.models.Review,
          as: "Reviews",
          attributes: {
            exclude: ["createdAt", "updatedAt"]
          },
          include: {
            model: sequelize.models.User,
            attributes: ["firstName", "lastName"]
          }
        },
        {
          model: sequelize.models.ProductSize,
          attributes: ["quantity", "color", "id"],
          include: {
            model: sequelize.models.Size,
            attributes: ["type"]
          }
        },
        {
          model: sequelize.models.ProductImage,
        },
      ],
      attributes: {
        exclude: ["createdAt", "updatedAt", "CategoryId"]
      }
    });

    // Check if the product exists
    if (!product) {
      return res.status(NOT_FOUND).json({
        message: "Product not found",
      });
    }

    const modifiedProduct = {
      id: product.id,
      name: product.name,
      description: product.description,
      price: product.price,
      featured: product.isFeatured,
      category: product.Category ? product.Category.categoryName : null,
      reviews: product.Reviews.map((review) => ({
        rating: review.rating,
        comment: review.comment,
        user:{
          id: review.UserId,
          name: review.User.firstName +" "+ review.User.lastName,
        }
      })),
      images: product.ProductImages.map((image) => image.imageUrl),
      sizes: product.ProductSizes.map((size) => {
        return {
          productSizeId: size.id,
          color: size.color,
          quantity: size.quantity,
          type: size.Size.type,
        }
      })
    };

    return res.status(SUCCESS).send(modifiedProduct);
  } catch (error) {
    console.error("Error getting product by ID:", error);
    return res
      .status(SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

// @desc update product basic info
// @route /product/:productId
// @access Privite
const updateProduct = asyncHandler(async (req, res) => {
  const productId = req.params.productId;
  const { name, description, price, isFeatured, categoryId } = req.body;

  try {
    // Find the product by ID
    const product = await sequelize.models.Product.findByPk(productId);

    // If the product doesn't exist
    if (!product) {
      return res
        .status(NOT_FOUND)
        .json({ message: "Product not found" });
    }

    // check the category exists or not if not return 404;
    if (categoryId) {
      const categoryResult = await categoryExists(categoryId);

      if (!categoryResult.isValid) {
        return res
          .status(NOT_FOUND)
          .send(categoryResult.error);
      }
    }
    // Update the product details
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.isFeatured = isFeatured || product.isFeatured;
    product.CategoryId = categoryId || product.CategoryId;

    // Save the updated product
    await product.save();

    res
      .status(SUCCESS)
      .json( product );
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

// @desc update productSize {color or quantity only}
// @route /product/:productId
// @access Privite
const updateProductSize = asyncHandler(async (req, res) => {
  const productSizeId = req.params.productSizeId;

  const { quantity, color} = req.body;

  try {
    // Find the product by ID
    const productSize = await sequelize.models.ProductSize.findByPk(productSizeId);

    // If the product doesn't exist
    if (!productSize) {
      return res
        .status(NOT_FOUND)
        .json({ message: "ProductSize not found!" });
    }

    // Update the productSize details
    productSize.quantity = quantity || productSize.quantity;
    productSize.color = color || productSize.color;
   

    // Save the updated product
    await productSize.save();

    res
      .status(SUCCESS)
      .json( productSize );
  } catch (error) {
    console.error("Error updating productSize:", error);
    res
      .status(SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

// @desc add new ProductSize
// @route /productsize
// @access Privite
const addProductSize = asyncHandler(async(req,res)=>{
  const { quantity, color, ProductId, SizeId} = req.body;

  try {
  
    // Find the product by ID
    const product = await sequelize.models.Product.findByPk(ProductId);

    // If the product doesn't exist
    if (!product) {
      return res
        .status(NOT_FOUND)
        .json({ message: "Product not found!" });
    }

    // Find the size by ID
    const size = await sequelize.models.Size.findByPk(SizeId);

    // If the size doesn't exist
    if (!size) {
      return res
        .status(NOT_FOUND)
        .json({ message: "Size not found!" });
    }

    try {
      const newProductSize = await sequelize.models.ProductSize.create({
        color,
        quantity,
        SizeId,
        ProductId
      })
  
      // Save the updated product
      await newProductSize.save();

      res
      .status(SUCCESS)
      .json( newProductSize );
    } catch (error) {
      res
      .status(SERVER_ERROR)
      .send(error);
    }
  } catch (error) {
    console.error("Error updating product:", error);
    res
      .status(SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
})

// @desc delete productSize
// @route /productsize/:productsizeid
// @access Privite
const deleteProductSize = asyncHandler(async (req, res) => {
  const productSizeId = req.params.productSizeId;

  try {
    // Find the product by ID
    const productSize = await sequelize.models.ProductSize.findByPk(productSizeId);

    // If the product doesn't exist
    if (!productSize) {
      return res
        .status(NOT_FOUND)
        .json({ message: "ProductSize not found" });
    }


    await productSize.destroy();

    res
      .status(SUCCESS)
      .json({ message: "ProductSize deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

// @desc delete product
// @route /product/:productId
// @access Privite
const deleteProduct = asyncHandler(async (req, res) => {
  const ProductId = req.params.productId;

  try {
    // Find the product by ID
    const product = await sequelize.models.Product.findByPk(ProductId);

    // If the product doesn't exist
    if (!product) {
      return res
        .status(NOT_FOUND)
        .json({ message: "Product not found" });
    }

    // Delete associated images in ProductImage table
    const productImages = await sequelize.models.ProductImage.findAll({
      where: {
        ProductId: product.id,
      },
    });

    // Define a function to delete an image file
    const deleteImageFile = async (image) => {
      await deleteFile(image.imageUrl);
    };

    // Loop through productImages and delete associated files
    try {
      await Promise.all(productImages.map(deleteImageFile));

    } catch (error) {
      console.log(error)
    }

    // Delete the product
    await sequelize.models.ProductImage.destroy({
      where: {
        ProductId,
      },
    });

    await product.destroy();

    res
      .status(SUCCESS)
      .json({ message: "Product deleted successfully" });
  } catch (error) {
    console.error("Error deleting product:", error);
    res
      .status(SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

// @desc get featured product
// @route /products/featured
// @access Public
const getAllFeaturedProducts = asyncHandler(async (req, res) => {
  try {
    const products = await sequelize.models.Product.findAll({
      where: {
        isFeatured: true,
      },
      include: [
        { model: sequelize.models.Category, as: "Category" },
        { model: sequelize.models.Manufacturer, as: "Manufacturer" },
        { model: sequelize.models.Review, as: "Reviews" },
        { model: sequelize.models.ProductImage, as: "ProductImages" },
      ],
    });

    return res.status(SUCCESS).json({ products });
  } catch (error) {
    console.error("Error getting all products:", error);
    return res
      .status(SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

export {
  addProduct,
  getAllProducts,
  getProductById,
  saveFiles,
  updateProduct,
  updateProductSize,
  addProductSize,
  deleteProductSize,
  deleteProduct,
  getAllFeaturedProducts,
};

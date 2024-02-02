import asyncHandler from "express-async-handler";
import { sequelize } from "../models/index.js";
import { join, dirname } from "path";
import { fileURLToPath } from "url";
import STATUS_CODES from "../constants/STATUS_CODES.js";
import deleteFile from "../utils/deleteFile.js";

const { NOT_FOUND, SERVER_ERROR, CREATED, SUCCESS, BAD_REQUEST } = STATUS_CODES;

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const addImages = asyncHandler(async (req, res, next) => {
  try {
    const files = req.files;
    const { productId } = req.params;

    // Find the product by ID
    const product = await sequelize.models.Product.findByPk(productId);

    // If the product doesn't exist
    if (!product) {
      return res.status(NOT_FOUND).json({ message: "Product not found" });
    }

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

    return res.status(CREATED).send(product);
  } catch (error) {
    console.error("Error saving files:", error);
    return res
      .status(SERVER_ERROR)
      .json({ message: "Error saving files", error });
  }
});

const deleteImage = asyncHandler(async (req, res, next) => {
  const { imageUrl, ProductId } = req.body;

  if (!imageUrl || !ProductId) {
    return res.status(NOT_FOUND).json({
      message: "Bad Request: imageUrl and ProductId are required.",
    });
  }

  try {
    await deleteFile(imageUrl);
    await sequelize.models.ProductImage.destroy({
      where: {
        imageUrl,
        ProductId,
      },
    });

    return res.status(SUCCESS).json({
      message: "Image deleted successfully.",
    });
  } catch (error) {
    return res.status(SERVER_ERROR).json({
      message: `Internal Server Error: ${error.message}`,
    });
  }
});

export { addImages, deleteImage };

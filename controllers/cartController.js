const asyncHandler = require("express-async-handler");
const STATUS_CODES = require("../constants/STATUS_CODES");
const db = require("../models");

// @method POST
// @desc Add a cart item
// @access Public
const addToCart = asyncHandler(async (req, res) => {
  const { quantity, productId } = req.body;

  try {
    // Check if both quantity and productId are provided
    if (!quantity || !productId) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: "Both quantity and productId are required fields.",
      });
    }

    // Check if the product exists
    const product = await db.Product.findByPk(productId);
    if (!product) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: "Product not found.",
      });
    }

    // Check if the requested quantity is valid
    if (product.stockQuantity < quantity) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message: "Requested quantity exceeds available stock.",
      });
    }

    // Create a new cart item
    const newCartItem = await db.CartItem.create({
      quantity,
      productId,
      userId: req.user.id,
    });

    res.status(STATUS_CODES.SUCCESS).json({
      message: "Product added to the cart successfully.",
      cartItem: newCartItem,
    });
  } catch (error) {
    console.error("Error adding new product:", error);
    return res.status(STATUS_CODES.SERVER_ERROR).json({
      message: "Internal Server Error",
    });
  }
});

// @method GET
// @desc Get cart items for the user
// @access Public
const getCartItems = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;

  try {
    // Retrieve cart items for the user
    const cartItems = await db.CartItem.findAll({
      where: {
        userId,
      },
    });

    res.status(STATUS_CODES.SUCCESS).json({
      message: "Cart items retrieved successfully.",
      cartItems,
    });
  } catch (error) {
    console.error("Error retrieving cart items:", error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      message: "Internal Server Error",
    });
  }
});

// @method PUT
// @desc Update the quantity of a cart item
// @access Public
const updateCartItemQuantity = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { cartItemId, quantity } = req.body;

  try {
    // Check if the cart item exists and belongs to the user
    const cartItem = await db.CartItem.findOne({
      where: {
        id: cartItemId,
        userId,
      },
    });

    if (!cartItem) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: "Cart item not found.",
      });
    }

    // Check if the requested quantity is valid
    const product = await db.Product.findByPk(cartItem.productId);

    if (!product || product.stockQuantity < quantity) {
      return res.status(STATUS_CODES.BAD_REQUEST).json({
        message:
          "Invalid quantity or product not available in sufficient stock.",
      });
    }

    // Update the quantity of the cart item
    await cartItem.update({ quantity });

    res.status(STATUS_CODES.SUCCESS).json({
      message: "Cart item quantity updated successfully.",
      updatedCartItem: await db.CartItem.findByPk(cartItemId),
    });
  } catch (error) {
    console.error("Error updating cart item quantity:", error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      message: "Internal Server Error",
    });
  }
});

// @method DELETE
// @desc Delete a cart item
// @access Public
const deleteCartItem = asyncHandler(async (req, res) => {
  const { id: userId } = req.user;
  const { cartItemId } = req.body;

  try {
    // Check if the cart item exists and belongs to the user
    const cartItem = await db.CartItem.findOne({
      where: {
        id: cartItemId,
        userId,
      },
    });

    if (!cartItem) {
      return res.status(STATUS_CODES.NOT_FOUND).json({
        message: "Cart item not found.",
      });
    }

    // Delete the cart item
    await cartItem.destroy();

    res.status(STATUS_CODES.SUCCESS).json({
      message: "Cart item deleted successfully.",
    });
  } catch (error) {
    console.error("Error deleting cart item:", error);
    res.status(STATUS_CODES.SERVER_ERROR).json({
      message: "Internal Server Error",
    });
  }
});

module.exports = {
  addToCart,
  getCartItems,
  updateCartItemQuantity,
  deleteCartItem,
};

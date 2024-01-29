const router = require("express").Router();
const cartController = require("../controllers/cartController");
const verifyJWT = require("../middlewares/verifyJWT");

/**
 * @swagger
 * tags:
 *   name: Cart
 *   description: API operations for user cart
 */

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add a cart item
 *     description: Add a new item to the user's cart.
 *     tags:
 *       - Cart
 *     security:
 *       - JWT: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               quantity:
 *                 type: integer
 *                 description: The quantity of the product to add to the cart.
 *                 example: 2
 *               productId:
 *                 type: integer
 *                 description: The ID of the product to add to the cart.
 *                 example: 1
 *     responses:
 *       '200':
 *         description: Product added to the cart successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                   example: Product added to the cart successfully.
 *                 cartItem:
 *                   $ref: '#/components/schemas/CartItem'
 *       '400':
 *         description: Bad request. Both quantity and productId are required fields, or requested quantity exceeds available stock.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message.
 *                   example: "Both quantity and productId are required fields."
 *       '404':
 *         description: Product not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message.
 *                   example: "Product not found."
 *       '422':
 *         description: Unprocessable Entity. Requested quantity exceeds available stock.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message.
 *                   example: "Requested quantity exceeds available stock."
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message.
 *                   example: "Internal Server Error."
 */
router.post("/", verifyJWT, cartController.addToCart);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get cart items for the user
 *     description: Get a list of cart items for the authenticated user.
 *     tags:
 *       - Cart
 *     security:
 *       - JWT: []
 *     responses:
 *       '200':
 *         description: Cart items retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/CartItem'
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message.
 *                   example: "Internal Server Error."
 */
router.get("/", verifyJWT, cartController.getCartItems);

/**
 * @swagger
 * /api/cart:
 *   put:
 *     summary: Update the quantity of a cart item
 *     description: Update the quantity of a cart item for the authenticated user.
 *     tags:
 *       - Cart
 *     security:
 *       - JWT: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartItemId:
 *                 type: integer
 *                 description: The ID of the cart item to update.
 *                 example: 1
 *               quantity:
 *                 type: integer
 *                 description: The new quantity of the cart item.
 *                 example: 3
 *     responses:
 *       '200':
 *         description: Cart item quantity updated successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                   example: Cart item quantity updated successfully.
 *                 updatedCartItem:
 *                   $ref: '#/components/schemas/CartItem'
 *       '400':
 *         description: Bad request. Cart item not found or invalid quantity.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message.
 *                   example: "Cart item not found."
 *       '404':
 *         description: Cart item not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message.
 *                   example: "Cart item not found."
 *       '422':
 *         description: Unprocessable Entity. Invalid quantity or product not available in sufficient stock.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message.
 *                   example: "Invalid quantity or product not available in sufficient stock."
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message.
 *                   example: "Internal Server Error."
 */
router.put("/", verifyJWT, cartController.updateCartItemQuantity);

/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Delete a cart item
 *     description: Delete a cart item for the authenticated user.
 *     tags:
 *       - Cart
 *     security:
 *       - JWT: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               cartItemId:
 *                 type: integer
 *                 description: The ID of the cart item to delete.
 *                 example: 1
 *     responses:
 *       '200':
 *         description: Cart item deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: A success message.
 *                   example: Cart item deleted successfully.
 *       '400':
 *         description: Bad request. Cart item not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message.
 *                   example: "Cart item not found."
 *       '404':
 *         description: Cart item not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message.
 *                   example: "Cart item not found."
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   description: The error message.
 *                   example: "Internal Server Error."
 */
router.delete("/", verifyJWT, cartController.deleteCartItem);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     CartItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *           description: The ID of the cart item.
 *           example: 1
 *         quantity:
 *           type: integer
 *           description: The quantity of the product in the cart.
 *           example: 2
 *         productId:
 *           type: integer
 *           description: The ID of the product.
 *           example: 1
 *         userId:
 *           type: integer
 *           description: The ID of the user.
 *           example: 123
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the cart item was created.
 *           example: '2023-01-01T12:00:00Z'
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the cart item was last updated.
 *           example: '2023-01-01T12:30:00Z'
 *       required:
 *         - quantity
 *         - productId
 *         - userId
 */

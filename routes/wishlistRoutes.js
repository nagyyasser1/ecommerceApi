const verifyJWT = require("../middlewares/verifyJWT");
const wishlistController = require("../controllers/wishlistController");
const router = require("express").Router();

/**
 * @swagger
 * tags:
 *    name: WishList
 *    description: The wishList managing API
 */

router.use(verifyJWT);

/**
 * @swagger
 * /api/wishlist:
 *   post:
 *     tags:
 *       - WishList
 *     description: Add a product to the user's wishlist
 *     summary: Add a product to the wishlist
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *             required:
 *               - productId
 *     responses:
 *       201:
 *         description: Product added to wishlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 wishlist:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       format: int64
 *                     userId:
 *                       type: integer
 *                       format: int64
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *       400:
 *         description: Bad Request
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

router.post("/", wishlistController.addProductToWishlist);

/**
 * @swagger
 * /api/wishlist:
 *   get:
 *     tags:
 *       - WishList
 *     description: Get the user's wishlist
 *     summary: Get the wishlist
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Wishlist retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 wishlist:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 *                       format: int64
 *                     userId:
 *                       type: integer
 *                       format: int64
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                     Products:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Product'
 *       404:
 *         description: Wishlist not found for the user
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

router.get("/", wishlistController.getWishlist);

/**
 * @swagger
 * /api/wishlist:
 *   delete:
 *     tags:
 *       - WishList
 *     description: Delete a product from the user's wishlist
 *     summary: Delete a product from the wishlist
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: integer
 *                 format: int64
 *     responses:
 *       200:
 *         description: Product deleted from the wishlist successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       400:
 *         description: Bad Request. productId is required.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       404:
 *         description: Wishlist not found or Product not found in the wishlist
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 */

router.delete("/", wishlistController.deleteProductFromWishlist);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Wishlist:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *         dateAdded:
 *           type: string
 *           format: date-time
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - dateAdded
 *         - userId
 */

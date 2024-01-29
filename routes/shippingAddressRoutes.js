const shippingAddressController = require("../controllers/shippingAddressController");
const verifyJWT = require("../middlewares/verifyJWT");
const router = require("express").Router();

/**
 * @swagger
 * tags:
 *    name: ShippingAddress
 *    description: The shippingAddress managing API
 */

/**
 * @swagger
 * /api/shipping-address:
 *   post:
 *     summary: Add a new shipping address
 *     tags:
 *       - ShippingAddress
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               streetAddress:
 *                 type: string
 *               city:
 *                 type: string
 *               state:
 *                 type: string
 *               zipCode:
 *                 type: string
 *               country:
 *                 type: string
 *               isDefault:
 *                 type: boolean
 *             required:
 *               - streetAddress
 *               - city
 *               - state
 *               - zipCode
 *               - country
 *               - isDefault
 *     responses:
 *       201:
 *         description: Shipping address added successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 shippingAddress:
 *                   $ref: '#/components/schemas/ShippingAddress'
 *       400:
 *         description: Bad Request. All fields are required.
 *       401:
 *         description: Unauthorized. JWT token is missing or invalid.
 *       500:
 *         description: Internal Server Error
 */

router.use(verifyJWT);
router.route("/").post(shippingAddressController.addShippingAddress);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     ShippingAddress:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *         streetAddress:
 *           type: string
 *         city:
 *           type: string
 *         state:
 *           type: string
 *         zipCode:
 *           type: string
 *         country:
 *           type: string
 *         isDefault:
 *           type: boolean
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *         userId:
 *           type: integer
 *           format: int64
 *       required:
 *         - streetAddress
 *         - city
 *         - state
 *         - zipCode
 *         - country
 *         - isDefault
 *         - userId
 */

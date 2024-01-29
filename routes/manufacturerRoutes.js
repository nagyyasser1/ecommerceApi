const manufacturerController = require("../controllers/manufacturerController");
const isAdmin = require("../middlewares/isAdmin");
const router = require("express").Router();

/**
 * @swagger
 * tags:
 *    name: Manufacturer
 *    description: The Manufacturer managing API
 */

/**
 * @swagger
 * /api/addManufacturer:
 *   post:
 *     summary: Add a new manufacturer
 *     description: Add a new manufacturer with the provided details. Requires authentication.
 *     tags: [Manufacturer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               manufacturerName:
 *                 type: string
 *                 description: Name of the manufacturer
 *                 example: Example Manufacturer
 *               description:
 *                 type: string
 *                 description: Description of the manufacturer
 *                 example: A reputable manufacturer with a long history
 *     responses:
 *       '201':
 *         description: Manufacturer added successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Manufacturer added successfully
 *                 manufacturer:
 *                   type: object
 *                   description: Details of the newly added manufacturer
 *                   properties:
 *                     manufacturerName:
 *                       type: string
 *                       example: Example Manufacturer
 *                     description:
 *                       type: string
 *                       example: A reputable manufacturer with a long history
 *       '400':
 *         description: Bad Request. Missing manufacturerName or description.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All fields required!
 *       '401':
 *         description: Unauthorized. Authentication token is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       '409':
 *         description: Conflict. Manufacturer with the same name already exists.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Manufacturer already exists!
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.post("/", isAdmin, manufacturerController.addManufacturer);

/**
 * @swagger
 * /api/getManufacturer:
 *   get:
 *     summary: Get all Manufacturer
 *     description: Retrieve a list of all manufacturers. Requires authentication with admin role.
 *     tags: [Manufacturer]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       '200':
 *         description: Manufacturers retrieved successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Manufacturers retrieved successfully
 *                 manufacturers:
 *                   type: array
 *                   description: List of manufacturers
 *                   items:
 *                     type: object
 *                     properties:
 *                       manufacturerName:
 *                         type: string
 *                         example: Example Manufacturer
 *                       description:
 *                         type: string
 *                         example: A reputable manufacturer with a long history
 *       '401':
 *         description: Unauthorized. Authentication token is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       '403':
 *         description: Forbidden. Only users with admin role can access this endpoint.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Access forbidden, admin role required
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Internal Server Error
 */
router.get("/", isAdmin, manufacturerController.getManufacturer);

/**
 * @swagger
 * /api/deleteManufacturer:
 *   delete:
 *     summary: Delete a manufacturer
 *     description: Delete a manufacturer with the provided manufacturerId. Requires authentication with admin role.
 *     tags: [Manufacturer]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               manufacturerId:
 *                 type: integer
 *                 description: ID of the manufacturer to be deleted
 *                 example: 1
 *     responses:
 *       '200':
 *         description: Manufacturer deleted successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Manufacturer with id : 1 deleted successfully"
 *       '400':
 *         description: Bad Request. Missing manufacturerId.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Provide manufacturerId"
 *       '401':
 *         description: Unauthorized. Authentication token is missing or invalid.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Unauthorized"
 *       '403':
 *         description: Forbidden. Only users with admin role can access this endpoint.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Access forbidden, admin role required"
 *       '500':
 *         description: Internal Server Error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Internal Server Error"
 */
router.delete("/", isAdmin, manufacturerController.deleteManufacturer);

module.exports = router;

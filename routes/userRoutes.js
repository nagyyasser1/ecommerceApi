const express = require("express");
const router = express.Router();
const usersController = require("../controllers/usersController");
const verifyJWT = require("../middlewares/verifyJWT");
const isAdmin = require("../middlewares/isAdmin");

/**
 * @swagger
 * tags:
 *    name: Users
 *    description: The users managing API
 */

/**
 * @swagger
 * /api/users:
 *   post:
 *     tags: [Users]
 *     summary: Register a new user
 *     description: Create a new user with the provided information
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/User'
 *     responses:
 *       201:
 *         description: User successfully created
 *         content:
 *           application/json:
 *             example:
 *               message: New user created
 *               user:
 *                 email: "example@example.com"
 *                 firstName: "John"
 *                 lastName: "Doe"
 *                 address: "123 Main St"
 *                 phone: "123-456-7890"
 *       400:
 *         description: Bad request, invalid input or missing fields
 *         content:
 *           application/json:
 *             example:
 *               message: All fields are required
 *       409:
 *         description: Conflict, duplicate email
 *         content:
 *           application/json:
 *             example:
 *               message: Duplicate email
 */
router.post("/", usersController.createNewUser);

/**
 * @swagger
 * /api/send-verification-token:
 *   post:
 *     tags: [Users]
 *     summary: Send email verification token
 *     description: Send an email containing a verification token for email verification
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *     responses:
 *       200:
 *         description: Verification email sent successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Verification email sent successfully
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal Server Error
 */
router.post("/send-verification-token", usersController.sendEmailVerification);

/**
 * @swagger
 * /api/users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     description: Retrieve a list of all users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: Users retrieved successfully
 *               users:
 *                 - id: 1
 *                   email: user1@example.com
 *                   firstName: John
 *                   lastName: Doe
 *                   address: 123 Main St
 *                   phone: 123-456-7890
 *                 - id: 2
 *                   email: user2@example.com
 *                   firstName: Jane
 *                   lastName: Doe
 *                   address: 456 Oak St
 *                   phone: 987-654-3210
 *       400:
 *         description: No users found
 *         content:
 *           application/json:
 *             example:
 *               message: No users found
 *       401:
 *         description: Unauthorized, authentication required
 *         content:
 *           application/json:
 *             example:
 *               message: Unauthorized
 */
router.get("/", isAdmin, usersController.getAllUsers);

/**
 * @swagger
 * /api/users/{userId}:
 *   get:
 *     tags: [Users]
 *     summary: Get user by ID
 *     description: Retrieve user details by providing the user ID
 *     parameters:
 *       - in: path
 *         name: userId
 *         schema:
 *           type: string
 *         required: true
 *         description: User ID
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: User details retrieved successfully
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               email: user1@example.com
 *               firstName: John
 *               lastName: Doe
 *               address: 123 Main St
 *               phone: 123-456-7890
 *               ShippingAddresses: [...]
 *               Reviews: [...]
 *       400:
 *         description: No user found
 *         content:
 *           application/json:
 *             example:
 *               message: No user found
 *       401:
 *         description: Unauthorized, authentication required
 *         content:
 *           application/json:
 *             example:
 *               message: Unauthorized
 */
router.get("/:userId", verifyJWT, usersController.getUserById);

/**
 * @swagger
 * /api/users/verify-email/{token}:
 *   get:
 *     tags: [Users]
 *     summary: Verify email
 *     description: Verify user email using the provided token
 *     parameters:
 *       - in: path
 *         name: token
 *         schema:
 *           type: string
 *         required: true
 *         description: Token to verify email
 *     responses:
 *       200:
 *         description: Email verification successful
 *         content:
 *           application/json:
 *             example:
 *               message: Email verification successful
 *               user:
 *                 id: 1
 *                 email: "user@example.com"
 *                 verified: true
 *       401:
 *         description: Unauthorized, user not found
 *         content:
 *           application/json:
 *             example:
 *               message: Unauthorized
 *       403:
 *         description: Forbidden, invalid token
 *         content:
 *           application/json:
 *             example:
 *               message: Forbidden
 */
router.get("/verify-email/:token", usersController.verifyEmail);

/**
 * @swagger
 * /api/users:
 *   patch:
 *     tags: [Users]
 *     summary: Make user admin
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *               isAdmin:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: User updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: User updated successfully
 *               user:
 *                 id: 1
 *                 username: example_user
 *                 isAdmin: true
 *       400:
 *         description: Bad request, isAdmin must be of type boolean
 *         content:
 *           application/json:
 *             example:
 *               message: isAdmin must be of type boolean
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               message: User not found
 *   delete:
 *     tags: [Users]
 *     summary: Delete user
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: integer
 *     responses:
 *       200:
 *         description: User deleted successfully
 *         content:
 *           application/json:
 *             example:
 *               message: User deleted successfully
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             example:
 *               message: User not found
 */
router.use(isAdmin);
router
  .route("/")
  .patch(usersController.makeUserAdmin)
  .delete(usersController.deleteUser);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       required:
 *         - email
 *       properties:
 *         id:
 *           type: integer
 *           description: The unique identifier for the user
 *           readOnly: true
 *         email:
 *           type: string
 *           format: email
 *           description: The user's email address
 *           uniqueItems: true
 *         password:
 *           type: string
 *           description: The user's password
 *           minLength: 8
 *           writeOnly: true
 *         firstName:
 *           type: string
 *           description: The user's first name
 *         lastName:
 *           type: string
 *           description: The user's last name
 *         address:
 *           type: string
 *           description: The user's address
 *         phone:
 *           type: string
 *           description: The user's phone number
 *         isAdmin:
 *           type: boolean
 *           description: Whether the user is an admin
 *           default: false
 *         verified:
 *           type: boolean
 *           description: Whether the user's email has been verified
 *           default: false
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the user was created
 *           readOnly: true
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The date and time the user was last updated
 *           readOnly: true
 */

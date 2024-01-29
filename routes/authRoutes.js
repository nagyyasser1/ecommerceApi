const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const loginLimiter = require("../middlewares/loginLimiter");
/**
 * @swagger
 * tags:
 *   name: Authentication
 *   description: API operations for user authentication
 */

/**
 * @swagger
 * /auth:
 *   post:
 *     summary: Authenticate user and generate access token
 *     description: Authenticate user using email and password, and generate an access token.
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *                 description: User's email address
 *                 example: user@example.com
 *               password:
 *                 type: string
 *                 description: User's password
 *                 example: password123
 *     responses:
 *       '200':
 *         description: Successfully authenticated. Returns an access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: JWT access token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ...
 *       '400':
 *         description: Bad Request. Missing email or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: All fields are required
 *       '401':
 *         description: Unauthorized. Invalid email or password.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 */

router.post("/", loginLimiter, authController.login);

/**
 * @swagger
 * /auth/refresh:
 *   get:
 *     summary: Refresh access token using refresh token
 *     description: Refresh the access token using the provided refresh token.
 *     tags: [Authentication]
 *     responses:
 *       '200':
 *         description: Successfully refreshed access token. Returns a new access token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 accessToken:
 *                   type: string
 *                   description: New JWT access token
 *                   example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZ...
 *       '401':
 *         description: Unauthorized. Invalid or missing refresh token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unauthorized
 *       '403':
 *         description: Forbidden. Invalid or expired refresh token.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Forbidden
 */

router.route("/refresh").get(authController.refresh);

/**
 * @swagger
 * /auth/logout:
 *   get:
 *     summary: Logout and clear authentication cookie
 *     description: Logout the user by clearing the authentication cookie.
 *     tags: [Authentication]
 *     responses:
 *       '204':
 *         description: Successfully logged out. No content.
 *       '200':
 *         description: Cookie cleared successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Cookie cleared
 */

router.route("/logout").post(authController.logout);

module.exports = router;

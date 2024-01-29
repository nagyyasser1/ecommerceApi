const categoryController = require("../controllers/categoryController");
const isAdmin = require("../middlewares/isAdmin");
const router = require("express").Router();

/**
 * @swagger
 * tags:
 *    name: Categories
 *    description: The category managing API
 */

router.use(isAdmin);

/**
 * @swagger
 * /api/category:
 *   get:
 *     tags: [Categories]
 *     description: Get all categories
 *     summary: Get all categories
 *     security:
 *       - isAdmin: []
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: Categories retrieved successfully
 *               categories:
 *                 - id: 1
 *                   categoryName: Category1
 *                   description: Description of Category1
 *                   createdAt: "2023-01-01T12:00:00Z"
 *                   updatedAt: "2023-01-01T12:30:00Z"
 *                 - id: 2
 *                   categoryName: Category2
 *                   description: Description of Category2
 *                   createdAt: "2023-01-02T10:00:00Z"
 *                   updatedAt: "2023-01-02T10:45:00Z"
 */
router.get("/", categoryController.getAllCategories);

/**
 * @swagger
 * /categories:
 *   post:
 *     tags: [Categories]
 *     description: Add a new category
 *     summary: Add a new category
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryName:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category added successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Category added successfully
 *               category:
 *                 id: 3
 *                 categoryName: NewCategory
 *                 description: Description of NewCategory
 *                 createdAt: "2023-01-03T14:00:00Z"
 *                 updatedAt: "2023-01-03T14:15:00Z"
 *       400:
 *         description: Bad request
 *         content:
 *           application/json:
 *             example:
 *               message: All fields are required!
 *       409:
 *         description: Conflict
 *         content:
 *           application/json:
 *             example:
 *               message: Category already exists!
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal Server Error
 */
router.post("/", categoryController.addCategory);

/**
 * @swagger
 * /categories:
 *   put:
 *     tags: [Categories]
 *     description: Update a category
 *     summary: Update a category
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               categoryId:
 *                 type: integer
 *                 format: int64
 *               categoryName:
 *                 type: string
 *               description:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Category updated successfully
 *               category:
 *                 id: 3
 *                 categoryName: UpdatedCategory
 *                 description: Updated description of UpdatedCategory
 *                 createdAt: "2023-01-03T14:00:00Z"
 *                 updatedAt: "2023-01-03T14:30:00Z"
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             example:
 *               message: Category not found.
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal Server Error
 */
router.put("/", categoryController.updateCategory);

/**
 * @swagger
 * /categories/{categoryId}:
 *   delete:
 *     tags: [Categories]
 *     description: Delete a category
 *     summary: Delete a category
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - name: categoryId
 *         in: path
 *         description: The ID of the category to delete
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       204:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 *         content:
 *           application/json:
 *             example:
 *               message: Category not found
 *       500:
 *         description: Server error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal Server Error
 */
router.delete("/:categoryId", categoryController.deleteCategory);

module.exports = router;

/**
 * @swagger
 * components:
 *   schemas:
 *     Category:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *         categoryName:
 *           type: string
 *           description: The name of the category
 *         description:
 *           type: string
 *           description: The description of the category
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the category was created
 *         updatedAt:
 *           type: string
 *           format: date-time
 *           description: The timestamp when the category was last updated
 *       required:
 *         - categoryName
 */

const router = require("express").Router();
const isAdmin = require("../middlewares/isAdmin");
const productsController = require("../controllers/productsController");
const fileUpload = require("express-fileupload");
const filePayloadExists = require("../middlewares/filesPayloadExists");
const fileSizeLimiter = require("../middlewares/fileSizeLimiter");
const fileExtLimiter = require("../middlewares/fileExtLimiter");

/**
 * @swagger
 * /api/products:
 *   get:
 *     tags: [Products]
 *     description: Get all products
 *     summary: Get all products
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number for pagination
 *       - in: query
 *         name: pageSize
 *         schema:
 *           type: integer
 *         description: Number of items per page
 *       - in: query
 *         name: categoryId
 *         schema:
 *           type: integer
 *         description: Filter products by category ID
 *       - in: query
 *         name: searchQuery
 *         schema:
 *           type: string
 *         description: Search products by name
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: Products retrieved successfully
 *               data:
 *                 products:
 *                   - id: 1
 *                     name: Product1
 *                     description: Product description 1
 *                     price: 19.99
 *                     category: { id: 1, name: "Category1" }
 *                     manufacturer: { id: 1, name: "Manufacturer1" }
 *                     reviews: [{ id: 1, rating: 4, comment: "Good product" }]
 *                     productImages: [{ id: 1, url: "image1.jpg" }]
 *                   - id: 2
 *                     name: Product2
 *                     description: Product description 2
 *                     price: 29.99
 *                     category: { id: 2, name: "Category2" }
 *                     manufacturer: { id: 2, name: "Manufacturer2" }
 *                     reviews: [{ id: 2, rating: 5, comment: "Excellent product" }]
 *                     productImages: [{ id: 2, url: "image2.jpg" }]
 */

router.get("/", productsController.getAllProducts);

/**
 * @swagger
 * /api/products/featured:
 *   get:
 *     tags: [Products]
 *     description: Get all featured products
 *     summary: Get all featured products
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               message: Featured products retrieved successfully
 *               products:
 *                 - id: 1
 *                   name: FeaturedProduct1
 *                   description: Featured product description 1
 *                   price: 39.99
 *                   category: { id: 1, name: "FeaturedCategory1" }
 *                   manufacturer: { id: 1, name: "FeaturedManufacturer1" }
 *                   reviews: [{ id: 1, rating: 4, comment: "Good featured product" }]
 *                   productImages: [{ id: 1, url: "featured-image1.jpg" }]
 *                 - id: 2
 *                   name: FeaturedProduct2
 *                   description: Featured product description 2
 *                   price: 49.99
 *                   category: { id: 2, name: "FeaturedCategory2" }
 *                   manufacturer: { id: 2, name: "FeaturedManufacturer2" }
 *                   reviews: [{ id: 2, rating: 5, comment: "Excellent featured product" }]
 *                   productImages: [{ id: 2, url: "featured-image2.jpg" }]
 */
router.get("/featured", productsController.getAllFeaturedProducts);

/**
 * @swagger
 * /api/product/{productId}:
 *   get:
 *      tags: [Products]
 *      summary: Get Product By Id
 *      description: Retrieve product details by providing the product ID
 *      parameters:
 *         - in: path
 *           name: productId
 *           schema:
 *             type: integer
 *           required: true
 *           description: The unique ID of the product
 *      responses:
 *         200:
 *           description: Success
 *           content:
 *             application/json:
 *               example:
 *                 id: 1
 *                 name: ProductName
 *                 description: Product description
 *                 price: 29.99
 *                 stockQuantity: 100
 *                 isFeatured: false
 *                 category: { id: 1, name: "CategoryName" }
 *                 manufacturer: { id: 1, name: "ManufacturerName" }
 *                 reviews: [
 *                   { id: 1, rating: 4, comment: "Good product" }
 *                 ]
 *                 productImages: [{ id: 1, url: "product-image1.jpg" }]
 *                 createdAt: "2023-01-05T09:15:00Z"
 *                 updatedAt: "2023-01-06T11:30:00Z"
 *         400:
 *           description: Bad request
 *           content:
 *             application/json:
 *               example:
 *                 message: Bad request
 *         404:
 *           description: Not Found
 *           content:
 *             application/json:
 *               example:
 *                 message: Product not found
 *         500:
 *           description: Server Error
 *           content:
 *             application/json:
 *               example:
 *                 message: Internal Server Error
 */
router.get("/:productId", productsController.getProductById);

/**
 * @swagger
 * /api/product:
 *   post:
 *      tags: [Products]
 *      summary: Add New Product
 *      description: Add a new product with file upload
 *      security:
 *        - BearerAuth: [] # Use if authentication is required
 *      requestBody:
 *        required: true
 *        content:
 *          multipart/form-data:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                description:
 *                  type: string
 *                price:
 *                  type: number
 *                stockQuantity:
 *                  type: integer
 *                categoryId:
 *                  type: integer
 *                manufacturerId:
 *                  type: integer
 *                file:
 *                  type: array
 *                  items:
 *                    type: string
 *                    format: binary
 *      responses:
 *         201:
 *           description: Product added successfully
 *           content:
 *             application/json:
 *               example:
 *                 message: Product added successfully
 *                 product:
 *                   id: 1
 *                   name: NewProduct
 *                   description: New product description
 *                   price: 29.99
 *                   stockQuantity: 100
 *                   isFeatured: false
 *                   category: { id: 1, name: "CategoryName" }
 *                   manufacturer: { id: 1, name: "ManufacturerName" }
 *                   reviews: []
 *                   productImages: [{ id: 1, url: "1image.jpg" }]
 *                   createdAt: "2023-01-05T09:15:00Z"
 *                   updatedAt: "2023-01-06T11:30:00Z"
 *         400:
 *           description: Bad request, missing required fields
 *           content:
 *             application/json:
 *               example:
 *                 message: Name, price, stockQuantity, categoryId, file, and manufacturerId are required!
 *         401:
 *           description: Unauthorized, authentication required
 *           content:
 *             application/json:
 *               example:
 *                 message: Unauthorized
 *         404:
 *           description: Category or Manufacturer not found
 *           content:
 *             application/json:
 *               example:
 *                 message: Category not found
 *         413:
 *           description: Payload too large, file size exceeds limit
 *           content:
 *             application/json:
 *               example:
 *                 message: Upload failed. File1.jpg and File2.png are over the file size limit of 5 MB.
 *         422:
 *           description: Unprocessable Entity, file type not allowed
 *           content:
 *             application/json:
 *               example:
 *                 message: Upload failed. Only .png, .jpg, .jpeg files allowed.
 *         500:
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               example:
 *                 message: Internal Server Error
 */

router.post(
  "/",
  isAdmin,
  fileUpload({ createParentPath: true }),
  filePayloadExists,
  fileExtLimiter([".png", ".jpg", ".jpeg"]),
  fileSizeLimiter,
  productsController.addProduct,
  productsController.saveFiles
);

/**
 * @swagger
 * /api/product/{productId}:
 *   put:
 *      tags: [Products]
 *      summary: Update Product
 *      description: Update details of a product
 *      security:
 *        - BearerAuth: [] # Use if authentication is required
 *      parameters:
 *        - in: path
 *          name: productId
 *          schema:
 *            type: integer
 *          required: true
 *          description: The unique ID of the product
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                name:
 *                  type: string
 *                description:
 *                  type: string
 *                price:
 *                  type: number
 *                stockQuantity:
 *                  type: integer
 *                isFeatured:
 *                  type: boolean
 *      responses:
 *         200:
 *           description: Product updated successfully
 *           content:
 *             application/json:
 *               example:
 *                 message: Product updated successfully
 *                 product:
 *                   id: 1
 *                   name: UpdatedProduct
 *                   description: Updated product description
 *                   price: 49.99
 *                   stockQuantity: 75
 *                   isFeatured: true
 *                   category: { id: 1, name: "CategoryName" }
 *                   manufacturer: { id: 1, name: "ManufacturerName" }
 *                   reviews: []
 *                   productImages: [{ id: 1, url: "1image.jpg" }]
 *                   createdAt: "2023-01-05T09:15:00Z"
 *                   updatedAt: "2023-01-07T14:45:00Z"
 *         400:
 *           description: Bad request, invalid input
 *           content:
 *             application/json:
 *               example:
 *                 message: Invalid input, please provide valid data
 *         401:
 *           description: Unauthorized, authentication required
 *           content:
 *             application/json:
 *               example:
 *                 message: Unauthorized
 *         404:
 *           description: Product not found
 *           content:
 *             application/json:
 *               example:
 *                 message: Product not found
 *         500:
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               example:
 *                 message: Internal Server Error
 */
router.put("/:productId", isAdmin, productsController.updateProduct);

/**
 * @swagger
 * /api/product/{productId}:
 *   delete:
 *      tags: [Products]
 *      summary: Delete Product
 *      description: Delete a product by its unique ID
 *      security:
 *        - BearerAuth: [] # Use if authentication is required
 *      parameters:
 *        - in: path
 *          name: productId
 *          schema:
 *            type: integer
 *          required: true
 *          description: The unique ID of the product to delete
 *      responses:
 *         200:
 *           description: Product deleted successfully
 *           content:
 *             application/json:
 *               example:
 *                 message: Product deleted successfully
 *         401:
 *           description: Unauthorized, authentication required
 *           content:
 *             application/json:
 *               example:
 *                 message: Unauthorized
 *         404:
 *           description: Product not found
 *           content:
 *             application/json:
 *               example:
 *                 message: Product not found
 *         500:
 *           description: Internal Server Error
 *           content:
 *             application/json:
 *               example:
 *                 message: Internal Server Error
 */
router.delete("/:productId", isAdmin, productsController.deleteProduct);

module.exports = router;

/**
 * @swagger
 * tags:
 *    name: Products
 *    description: the products managing api
 * components:
 *     schemas:
 *       Product:
 *         type: object
 *         properties:
 *           id:
 *             type: integer
 *             format: int64
 *           name:
 *             type: string
 *           description:
 *             type: string
 *           price:
 *             type: number
 *             format: double
 *           stockQuantity:
 *             type: integer
 *           isFeatured:
 *             type: boolean
 *           createdAt:
 *             type: string
 *             format: date-time
 *           updatedAt:
 *             type: string
 *             format: date-time
 *           categoryId:
 *             type: integer
 *           manufacturerId:
 *             type: integer
 */

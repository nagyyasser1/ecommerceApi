import verifyJWT from "../middlewares/verifyJWT.js";
import {
  addOrder,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
} from "../controllers/orderController.js";
import { Router } from "express";
import isAdmin from "../middlewares/isAdmin.js";
import { validateNewOrderData } from "../utils/validations/order.validations.js";

const router = Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *      tags: [Order]
 *      description: Add New Order
 *      summary: add new order
 *      security:
 *        - bearerAuth: []  # Use if authentication is required
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                orderDate:
 *                  type: string
 *                  format: date-time
 *                totalAmount:
 *                  type: number
 *                  format: double
 *                products:
 *                  type: array
 *                  items:
 *                    type: object
 *                    properties:
 *                      productId:
 *                        type: integer
 *                      quantity:
 *                        type: integer
 *              required:
 *                - orderDate
 *                - totalAmount
 *                - products
 *      responses:
 *           201:
 *             description: Order added successfully
 *             content:
 *               application/json:
 *                 example:
 *                   message: Order added successfully
 *                   order:
 *                     $ref: '#/components/schemas/Order'  # Reference to the Order schema
 *           400:
 *             description: Bad request, invalid input or missing fields
 *             content:
 *               application/json:
 *                 example:
 *                   message: Validation error
 *                   error: "Detailed validation error message"
 *           401:
 *             description: Unauthorized, authentication required
 *             content:
 *               application/json:
 *                 example:
 *                   message: Unauthorized
 *           500:
 *             description: Internal Server Error
 *             content:
 *               application/json:
 *                 example:
 *                   message: Internal Server Error
 */

router.post("/", verifyJWT, validateNewOrderData, addOrder);

/**
 * @swagger
 * /api/orders:
 *   get:
 *      tags: [Order]
 *      description: Get All Orders
 *      summary: get all orders
 *      security:
 *        - bearerAuth: []  # Use if authentication is required
 *      responses:
 *           200:
 *             description: Orders retrieved successfully
 *             content:
 *               application/json:
 *                 example:
 *                   message: Orders retrieved successfully
 *                   orders:
 *                     type: array
 *                     items:
 *                       $ref: '#/components/schemas/Order'  # Reference to the Order schema
 *           500:
 *             description: Internal Server Error
 *             content:
 *               application/json:
 *                 example:
 *                   message: Internal Server Error
 */

router.get("/", verifyJWT, getAllOrders);

/**
 * @swagger
 * /api/orders:
 *   put:
 *      tags: [Order]
 *      description: Update Order Status
 *      summary: update order status
 *      security:
 *        - bearerAuth: []  # Use if authentication is required
 *      requestBody:
 *        required: true
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                status:
 *                  type: string
 *                  description: New status for the order
 *                orderId:
 *                  type: integer
 *                  format: int64
 *                  description: The unique ID of the order
 *              required:
 *                - status
 *                - orderId
 *      responses:
 *           200:
 *             description: Order status updated successfully
 *             content:
 *               application/json:
 *                 example:
 *                   message: Order status updated successfully
 *                   order:
 *                     $ref: '#/components/schemas/Order'  # Reference to the Order schema
 *           404:
 *             description: Order not found
 *             content:
 *               application/json:
 *                 example:
 *                   message: Order not found
 *           500:
 *             description: Internal Server Error
 *             content:
 *               application/json:
 *                 example:
 *                   message: Internal Server Error
 */

router.patch("/status", isAdmin, updateOrderStatus);

/**
 * @swagger
 * /api/orders/cancel/{orderId}:
 *   patch:
 *     tags: [Order]
 *     description: Cancel Order , only admin can cancel shipped order
 *     summary: Cancel an order
 *     security:
 *       - bearerAuth: []  # Use if authentication is required
 *     parameters:
 *       - name: orderId
 *         in: path
 *         description: The unique ID of the order to be canceled
 *         required: true
 *         schema:
 *           type: integer
 *           format: int64
 *     responses:
 *       200:
 *         description: Order canceled successfully
 *         content:
 *           application/json:
 *             example:
 *               message: Order canceled successfully
 *       403:
 *         description: Cannot cancel a shipped order
 *         content:
 *           application/json:
 *             example:
 *               message: Can't cancel shipped order!
 *       404:
 *         description: Order not found
 *         content:
 *           application/json:
 *             example:
 *               message: Order not found
 *       500:
 *         description: Internal Server Error
 *         content:
 *           application/json:
 *             example:
 *               message: Internal Server Error
 */

router.delete("/cancel/:orderId", verifyJWT, cancelOrder);

export default router;

/**
 * @swagger
 * tags:
 *   name: Order
 *   description: Order schema
 * components:
 *   schemas:
 *     Order:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *         orderDate:
 *           type: string
 *           format: date-time
 *         totalAmount:
 *           type: number
 *           format: double
 *         orderStatus:
 *           type: string
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
 *         - orderDate
 *         - totalAmount
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     OrderItem:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *           format: int64
 *         quantity:
 *           type: integer
 *         subtotal:
 *           type: number
 *           format: double
 *         createdAt:
 *           type: string
 *           format: date-time
 *         updatedAt:
 *           type: string
 *           format: date-time
 *       required:
 *         - quantity
 *         - subtotal
 */

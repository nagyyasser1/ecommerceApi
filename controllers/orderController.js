import asyncHandler from "express-async-handler";
import { sequelize } from "../models/index.js";
import ORDER_STATUS from "../constants/ORDER_STATUS.js";
const { CREATED, SERVER_ERROR, NOT_FOUND, SUCCESS, UNAUTHORIZED, FORBIDDEN } = ORDER_STATUS;

const {SHIPPED} = ORDER_STATUS;

const checkOrderRequirements = async (products) => {
  if (!products || products.length === 0) {
    throw new Error("At least one product is required!");
  }

  // Check if all products exist and have sufficient stock
  const productsWithStock = await Promise.all(
    products.map(async (product) => {
      const { productId, quantity } = product;

      // Use findOne to check if the product exists and has sufficient stock
      const existingProduct = await sequelize.models.Product.findOne({
        where: {
          id: productId,
          stockQuantity: {
            [sequelize.models.Sequelize.Op.gte]: quantity,
          },
        },
      });

      if (!existingProduct) {
        throw new Error(
          `Product with ID ${productId} does not exist or has insufficient stock!`
        );
      }

      return {
        productId: existingProduct.id,
        quantity,
      };
    })
  );

  return productsWithStock;
};

const createOrderItems = async (order, productsWithStock, transaction) => {
  for (const [index, product] of productsWithStock.entries()) {
    const { productId, quantity } = productsWithStock[index];

    // Get the product price
    const productPrice = product.price;

    // Calculate the subtotal
    const subtotal = productPrice * quantity;

    // Create order item
    await sequelize.models.OrderItem.create(
      {
        orderId: order.id,
        productId,
        quantity,
        price: productPrice,
        subtotal, // Include the calculated subtotal
      },
      { transaction }
    );
  }
};

const decrementProductStock = async (productId, quantity, transaction) => {
  // Decrement the stockQuantity of the product
  await sequelize.models.Product.decrement("stockQuantity", {
    by: quantity,
    where: { id: productId },
    transaction,
  });
};

const addOrder = asyncHandler(async (req, res) => {
  const { orderDate, totalAmount, products } = req.body;
  const userId = req.user.id;

  try {
    // Use the build method to create a new order instance without saving it to the database
    const newOrder = await sequelize.models.Order.build({
      orderDate,
      totalAmount,
      userId,
    });

    // Check order requirements
    const productsWithStock = await checkOrderRequirements(products);

    // Create order items and save the order
    await sequelize.models.sequelize.transaction(async (t) => {
      // Save the order to the database
      await newOrder.save({ transaction: t });

      // Create order items
      await createOrderItems(newOrder, productsWithStock, t);

      // Decrement product stock
      for (const [index, product] of productsWithStock.entries()) {
        const { productId, quantity } = productsWithStock[index];
        await decrementProductStock(productId, quantity, t);
      }
    });

    return res.status(CREATED).json({
      message: "Order added successfully",
      order: newOrder,
    });
  } catch (error) {
    console.error("Error adding new order:", error);

    // Send detailed error message to the client
    return res.status(SERVER_ERROR).json({
      message: "Internal Server Error",
      error: error.message, // Include the detailed error message
    });
  }
});

const updateOrderStatus = asyncHandler(async (req, res) => {
  const { status, orderId } = req.body;

  try {
    // Find the order by ID
    const order = await sequelize.models.Order.finsequelize.modelsyPk(orderId);

    // If the order doesn't exist
    if (!order) {
      return res
        .status(NOT_FOUND)
        .json({ message: "Order not found" });
    }

    // Update the status field
    order.orderStatus = status;

    // Save the changes to the database
    await order.save();

    return res.status(SUCCESS).json({
      message: "Order status updated successfully",
      order,
    });
  } catch (error) {
    console.error("Error updating order status:", error);
    return res
      .status(SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

const getAllOrders = asyncHandler(async (req, res) => {
  try {
    // Find all orders and include associated data (e.g., order items)
    const orders = await sequelize.models.Order.findAll({
      include: [
        {
          model: sequelize.models.OrderItem,
          include: [sequelize.models.Product],
        },
        sequelize.models.User, // Include associated user
      ],
    });

    return res.status(SUCCESS).json({
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    console.error("Error getting all orders:", error);
    return res
      .status(SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

const getMyOrders = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  try {
    // Find all orders associated with the user
    const orders = await sequelize.models.Order.findAll({
      where: { userId },
      include: [sequelize.models.OrderItem], // Include associated order items in the query
    });

    if (!orders || orders.length === 0) {
      return res
        .status(NOT_FOUND)
        .json({ message: "No orders found for the user" });
    }

    res.status(SUCCESS).json({
      message: "Orders retrieved successfully",
      orders,
    });
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res
      .status(SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

const deleteOrder = asyncHandler(async (req, res) => {
  const orderId = req.body.orderId;
  const userId = req.user.id;

  try {
    // Find the order
    const order = await sequelize.models.Order.findOne({
      where: { id: orderId },
    });

    // If the order is not found
    if (!order) {
      return res
        .status(NOT_FOUND)
        .json({ message: "Order not found" });
    }

    // Check if the user is the owner of the order or isAdmin
    // ()
    if (order.userId !== userId && !req.user.isAdmin) {
      return res
        .status(UNAUTHORIZED)
        .json({ message: "Unauthorized to delete this order" });
    }

    // Delete the order
    await order.destroy();

    res.status(SUCCESS).json({
      message: "Order deleted successfully",
    });
  } catch (error) {
    console.error("Error deleting order:", error);
    res
      .status(SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

// Function to cancel an order
const cancelOrder = asyncHandler(async (req, res) => {
  const orderId = req.params.orderId;
  const userId = req.user.id;
  const { isAdmin } = req.user;

  try {
    // Find the order
    const order = await sequelize.models.Order.findOne({
      where: {
        id: orderId,
        userId,
      },
      include: [
        {
          model: sequelize.models.OrderItem,
          as: "OrderItems",
          include: [
            {
              model: sequelize.models.Product,
              as: "Product",
            },
          ],
        },
      ],
    });

    // Check if order and order.orderItems exist
    if (!order || !order?.OrderItems) {
      return res.status(NOT_FOUND).json({
        message: "Order not found",
      });
    }

    if (order.orderStatus === SHIPPED && !isAdmin) {
      return res.status(FORBIDDEN).json({
        message: "Can't cancel shipped order!",
      });
    }

    // Restock products and delete order items
    await sequelize.models.sequelize.transaction(async (t) => {
      for (const orderItem of order.OrderItems) {
        if (orderItem.Product) {
          const { Product: product, quantity } = orderItem;

          // Restock product quantity
          await sequelize.models.Product.increment("stockQuantity", {
            by: quantity,
            where: { id: product.id },
            transaction: t,
          });
        }

        // Delete order item
        await orderItem.destroy({ transaction: t });
      }

      // Delete the order
      await order.destroy({ transaction: t });
    });

    return res.status(SUCCESS).json({
      message: "Order canceled successfully",
    });
  } catch (error) {
    console.error("Error canceling order:", error);
    return res
      .status(SERVER_ERROR)
      .json({ message: "Internal Server Error" });
  }
});

export  {
  addOrder,
  updateOrderStatus,
  getAllOrders,
  getMyOrders,
  deleteOrder,
  cancelOrder,
};

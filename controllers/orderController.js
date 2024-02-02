import asyncHandler from "express-async-handler";
import { sequelize } from "../models/index.js";
import ORDER_STATUS from "../constants/ORDER_STATUS.js";
import STATUS_CODES from "../constants/STATUS_CODES.js";
const { CREATED, SERVER_ERROR, NOT_FOUND, SUCCESS, UNAUTHORIZED, FORBIDDEN } =
  STATUS_CODES;

const { SHIPPED } = ORDER_STATUS;

const checkOrderRequirements = async (products) => {
  // Check if all products exist and have sufficient stock
  const productsWithStock = await Promise.all(
    products.map(async (product) => {
      const { ProductId, SizeId, quantity, color } = product;

      // Use findOne to check if the product exists and has sufficient stock
      const existingProductSize = await sequelize.models.ProductSize.findOne({
        where: {
          ProductId,
          SizeId,
          color,
          quantity: {
            [sequelize.Sequelize.Op.gte]: quantity,
          },
        },
      });

      if (!existingProductSize) {
        throw new Error(
          `Product with ID ${ProductId} does not exist or has insufficient stock, color , size!`
        );
      }

      const existingProduct = await sequelize.models.Product.findByPk(
        ProductId
      );

      return {
        ProductId,
        ProductSizeId: existingProductSize.id,
        SizeId,
        color,
        quantity,
        product_price: existingProduct.price,
      };
    })
  );

  return productsWithStock;
};

const createOrderItems = async (order, productsWithStock, transaction) => {
  for (let i = 0; i < productsWithStock.length; i++) {
    const { ProductSizeId, quantity, product_price } = productsWithStock[i];

    // Calculate the subtotal
    const subtotal = product_price * quantity;

    // Create order item
    await sequelize.models.OrderItem.create(
      {
        OrderId: order.id,
        ProductSizeId,
        quantity,
        subtotal,
      },
      { transaction }
    );
  }
};

const decrementProductSizeStock = async (
  ProductSizeId,
  quantity,
  transaction
) => {
  await sequelize.models.ProductSize.decrement("quantity", {
    by: quantity,
    where: { id: ProductSizeId },
    transaction,
  });
};

const calcTotalPrice = (products) => {
  let price = 0;
  for (let i = 0; i < products.length; i++) {
    price += +products[i].product_price * +products[i].quantity;
  }
  return price;
};

const addOrder = asyncHandler(async (req, res) => {
  const {
    products,
    shipping_address: { city, town, street },
  } = req.body;

  const UserId = req.user.id;

  try {
    const productsWithStock = await checkOrderRequirements(products);

    let order;
    // Create order items and save the order
    await sequelize.transaction(async (t) => {
      // Save the order to the database
      order = await sequelize.models.Order.create(
        {
          UserId,
          shipping_address: `${city},${town},${street}`,
          total_amount: calcTotalPrice(productsWithStock),
        },
        { transaction: t }
      );

      // Create order items
      await createOrderItems(order, productsWithStock, t);

      // Decrement product stock
      for (const [index, product] of productsWithStock.entries()) {
        const { quantity, ProductSizeId } = productsWithStock[index];
        await decrementProductSizeStock(ProductSizeId, quantity, t);
      }
    });

    return res.status(CREATED).send(order);
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
    const order = await sequelize.models.Order.findByPk(orderId);

    // If the order doesn't exist
    if (!order) {
      return res.status(NOT_FOUND).json({ message: "Order not found" });
    }

    // Update the status field
    order.status = status;

    // Save the changes to the database
    await order.save();

    return res.status(SUCCESS).send(order);
  } catch (error) {
    console.error("Error updating order status:", error);
    return res.status(SERVER_ERROR).json({ message: "Internal Server Error" });
  }
});

const getAllOrders = asyncHandler(async (req, res, next) => {
  const { isAdmin, id: userId } = req.user;

  const whereCondition = {};

  if (!isAdmin) {
    whereCondition["UserId"] = userId;
  }

  try {
    const orders = await sequelize.models.Order.findAll({
      where: whereCondition,
      include: [
        {
          model: sequelize.models.OrderItem,
          attributes: {
            exclude: ["id", "OrderId", "ProductSizeId"],
          },
          include: {
            model: sequelize.models.ProductSize,
            include: [
              { model: sequelize.models.Product },
              { model: sequelize.models.Size },
            ],
          },
        },
        {
          model: sequelize.models.User,
          attributes: ["id", "phone", "address", "firstName", "lastName"],
        },
      ],
      attributes: {
        exclude: ["UserId"],
      },
    });

    const modifiedOrders = orders.map((order) => {
      return {
        id: order.id,
        totalAmount: order.total_amount,
        status: order.status,
        shippingAddress: order.shipping_address,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        user: order.User,
        orderItems: order.OrderItems.map((item) => {
          return {
            productId: item.ProductSize.Product.id,
            productName: item.ProductSize.Product.name,
            quantity: item.quantity,
            subtotal: item.subtotal,
            color: item.ProductSize.color,
            size: item.ProductSize.Size.type,
          };
        }),
      };
    });
    return res.status(SUCCESS).send(modifiedOrders);
  } catch (error) {
    console.error("Error getting all orders:", error);
    return res.status(SERVER_ERROR).json({ message: "Internal Server Error" });
  }
});

const getMyOrders = asyncHandler(async (req, res) => {
  const UserId = req.user.id;

  try {
    const orders = await sequelize.models.Order.findAll({
      where: { UserId },
      include: [sequelize.models.OrderItem],
    });

    if (!orders || orders.length === 0) {
      return res
        .status(NOT_FOUND)
        .json({ message: "No orders found for the user" });
    }

    res.status(SUCCESS).send(orders);
  } catch (error) {
    console.error("Error retrieving orders:", error);
    res.status(SERVER_ERROR).json({ message: "Internal Server Error" });
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
      return res.status(NOT_FOUND).json({ message: "Order not found" });
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
    res.status(SERVER_ERROR).json({ message: "Internal Server Error" });
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
    return res.status(SERVER_ERROR).json({ message: "Internal Server Error" });
  }
});

export {
  addOrder,
  updateOrderStatus,
  getAllOrders,
  getMyOrders,
  deleteOrder,
  cancelOrder,
};

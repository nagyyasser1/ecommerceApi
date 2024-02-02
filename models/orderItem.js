// orderItem.js
import { DataTypes } from "sequelize";
import { sequelize } from "./index.js";

const defineOrderItemModel = () => {
  const OrderItem = sequelize.define(
    "OrderItem",
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      subtotal: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
      },
    },
    {
      timestamps: false,
    }
  );

  return OrderItem;
};

export default defineOrderItemModel;

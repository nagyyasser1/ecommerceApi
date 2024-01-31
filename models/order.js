// order.js
import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const defineOrderModel = () => {
  const Order = sequelize.define('Order', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    total_amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "Pending",
    },
    shipping_address: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return Order;
};

export default defineOrderModel;

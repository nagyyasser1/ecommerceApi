import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const defineProductSizeModel = () => {
  const ProductSize = sequelize.define('ProductSize', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
      unique: false
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: false
    },
  }, {
    timestamps: false,
    primaryKey: ['ProductId','SizeId','color','quantity']
  });

  return ProductSize;
};

export default defineProductSizeModel;

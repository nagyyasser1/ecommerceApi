// productImage.js
import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const defineProductImageModel = () => {
  const ProductImage = sequelize.define('ProductImage', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return ProductImage;
};

export default defineProductImageModel;

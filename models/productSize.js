import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const defineProductSizeModel = () => {
  const ProductSize = sequelize.define('ProductSize', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    color: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    ProductId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Products',
        key: 'id'
      }
    },
    SizeId: {
      type: DataTypes.INTEGER,
      references: {
        model: 'Sizes',
        key: 'id',
      }
    }
  }, {
    timestamps: false,
    indexes: [
      {
        fields: ["ProductId","SizeId","color"],
        unique: true
      }
    ]
  });

  return ProductSize;
};

export default defineProductSizeModel;

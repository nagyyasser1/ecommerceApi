// category.js
import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const defineCategoryModel = () => {
  const Category = sequelize.define('Category', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    categoryName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
    },
  }, {
    timestamps: false
  });

  return Category;
};

export default defineCategoryModel;

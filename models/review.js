// review.js
import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const defineReviewModel = () => {
  const Review = sequelize.define('Review', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    rating: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    comment: {
      type: DataTypes.TEXT,
    },
  });

  return Review;
};

export default defineReviewModel;

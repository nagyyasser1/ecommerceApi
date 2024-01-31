import { DataTypes } from 'sequelize';
import { sequelize } from './index.js';

const defineSizeModel = () => {
  const Size = sequelize.define('Size', {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    },
    type: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  }, {
    timestamps: false
  });

  return Size;
};

export default defineSizeModel;

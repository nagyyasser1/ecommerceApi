const { Sequelize, DataTypes } = require('sequelize');
const config = require('../config/config.json');

// Create New Squelize Instance
const sequelize = new Sequelize(config.development);

// Import Our Models
const Product      = require('./product')(sequelize, DataTypes);
const Size         = require('./size')(sequelize, DataTypes);
const ProductSize  = require('./productSize')(sequelize, DataTypes);
const ProductImage = require('./productImage')(sequelize, DataTypes);
const User         = require('./user')(sequelize, DataTypes);
const Category     = require('./category')(sequelize, DataTypes);
const Order        = require('./order')(sequelize, DataTypes);
const OrderItem    = require('./orderItem')(sequelize, DataTypes);
const Review       = require('./review')(sequelize, DataTypes);

// Define User Associations
User.hasMany(Order);
User.hasMany(Review);

// Define Order Associations
Order.hasMany(OrderItem);
Order.belongsTo(User);

// Define OrderItem Associations
OrderItem.belongsTo(Order);
OrderItem.belongsTo(ProductSize);

// Define Review Associations
Review.belongsTo(User);

// Define Category Associations
Category.hasMany(Product);

// Define Product Associations
Product.belongsTo(Category);

// Define ProductSize Associations
ProductSize.hasMany(OrderItem);

module.exports = {
  sequelize,
  Product,
  Size,
  ProductSize,
  ProductImage,
  User,
  Category,
  Order,
  OrderItem,
  Review
};

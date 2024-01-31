import { Sequelize, DataTypes } from 'sequelize';
import environment from '../config/config.js';

// Create New Sequelize Instance
export const sequelize = new Sequelize(environment.development);

// Import and define associations
import defineProductModel from './product.js';
import defineSizeModel from './size.js';
import defineProductSizeModel from './productSize.js';
import defineProductImageModel from './productImage.js';
import defineUserModel from './user.js';
import defineCategoryModel from './category.js';
import defineOrderModel from './order.js';
import defineOrderItemModel from './orderItem.js';
import defineReviewModel from './review.js';

// Define models
const Product = defineProductModel();
const Size = defineSizeModel();
const ProductSize = defineProductSizeModel();
const ProductImage = defineProductImageModel();
const User = defineUserModel();
const Category = defineCategoryModel();
const Order = defineOrderModel();
const OrderItem = defineOrderItemModel();
const Review = defineReviewModel();

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
Review.belongsTo(Product);

// Define Category Associations
Category.hasMany(Product);

// Define Product Associations
Product.hasMany(ProductImage);
Product.hasMany(Review);
Product.belongsTo(Category);
Product.belongsToMany(Size, {through: ProductSize});
Product.hasMany(ProductSize);

// Define ProductSize Associations
ProductSize.hasMany(OrderItem);
ProductSize.belongsTo(Product);
ProductSize.belongsTo(Size);


// Define Size Associations;
Size.belongsToMany(Product, {through: ProductSize});
Size.hasMany(ProductSize);



// Define ProductImage Associations
ProductImage.belongsTo(Product);

export {
  Product,
  Size,
  ProductSize,
  ProductImage,
  User,
  Category,
  Order,
  OrderItem,
  Review,
};
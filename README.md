# EcommerceAPI

![EcommerceAPI Logo](https://imgs.search.brave.com/sfAuUaG5iJ01KJv9KbuCwgGOrLv9ZIdfp48TTr8lSrQ/rs:fit:500:0:0/g:ce/aHR0cHM6Ly91cGxv/YWQud2lraW1lZGlh/Lm9yZy93aWtpcGVk/aWEvY29tbW9ucy85/LzkwL0NvbWVyY2lv/X2VsZWN0cm9uaWNv/LmpwZw)

EcommerceAPI is an open-source Node.js application that empowers small businesses to effortlessly manage and sell their clothing products online. This API provides a comprehensive set of features for handling products, orders, sizes, categories, reviews, and seamless communication with customers via email.

## Features

- **Product Management:** Easily manage your product catalog, including details like name, description, and images.

- **Order Management:** Efficiently handle customer orders, track order status, and manage order items.

- **Size Management:** Organize your products by sizes, making it convenient for customers to find the perfect fit.

- **Category Management:** Categorize your products to enhance user navigation and browsing.

- **Review System:** Enable customers to leave reviews, providing valuable feedback and building trust.

- **User Authentication:** Implement secure token-based authentication for user registration, login, logout, and token refresh.

- **Email Verification:** Ensure the authenticity of users by incorporating email verification during the registration process.

- **Communication with Gmail:** Allow customers to contact business owners directly through Gmail.

- **Data Validation and Integration:** Implement robust data validation and integration to maintain data integrity.

## Database Schema

- **Users:** Store user information including authentication details.
  
- **Products:** Maintain product details such as name, description, and price.

- **Orders:** Keep track of customer orders and order status.

- **OrderItems:** Manage individual items within an order.

- **Size:** Store size information for products.

- **ProductSize:** Connect products with their respective sizes.

- **Review:** Capture customer reviews for products.

- **ProductImage:** Store images associated with products.

## Installation

1. Clone the repository:
   
```bash
   git clone https://github.com/nagyyasser1/ecommerceApi.git
```
2. Navigate to the project directory:

```bash
  cd ecommerce-api
```
3. Install dependencies:

```bash
  npm install
```

4. Run the application:
```bash
  npm start
```


## Usage

1. After starting the application, you can access the API at `http://localhost:3000`.

2. Utilize the provided API endpoints for managing products, orders, sizes, categories, reviews, and user authentication.

## Screenshots

Include screenshots or images showcasing the user interface or functionality of your application. This section is optional but can be beneficial for users to have a visual understanding of your project.

## API Documentation

For detailed API documentation, refer to the [API Documentation](link_to_api_documentation.md) file.

## Dependencies

List the major dependencies for your project .

- Node.js
- Express
- Postgres 
- Sequelize 
- Nodemailer 
- Jsonwebtoken 

## Contributing

EcommerceAPI is an open-source project, and contributions are welcome! Please follow our [contribution guidelines](CONTRIBUTING.md).

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

For inquiries or assistance, please contact us at your-email@gmail.com.

Feel free to explore the code, raise issues, and contribute to the development of EcommerceAPI! Happy coding!

![Open Source](https://img.shields.io/badge/Open%20Source-Yes-green.svg)


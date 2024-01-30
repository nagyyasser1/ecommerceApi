require("dotenv").config();
const express = require("express");
const app = express();
const cors = require("cors");
const path = require("path");
const cookieParser = require("cookie-parser");
const corsOptions = require("./config/corsOptions");
const { logger, logEvents } = require("./middlewares/logger");
const notFound = require("./middlewares/notFound");
const errorHandler = require("./middlewares/errorHandler");
const swaggerUI = require("swagger-ui-express");
const swaggerJsDoc = require("swagger-jsdoc");
const swaggerOpt = require("./config/swaggerOpt");
const { sequelize } = require("./models");

const PORT = process.env.PORT || 3500;

// Setup Useful Middlewares
app.use(logger); //log every request 
app.use(cors(corsOptions)); //allow only specific origins 
app.use(express.json());  //parse application/json 
app.use(express.urlencoded({ extended: true }));   //parse form data
app.use(cookieParser());

// Serve statatic files on specific path
app.use("/", express.static(path.join(__dirname, "uploads")));

app.get('/add', (req,res)=>{
  res.sendFile(path.join(__dirname+"/views"+'/addProduct.html'));
})

// Api routes
app.use("/", require("./routes/route")); // api welcome page
app.use("/auth", require("./routes/authRoutes")); // andle authentication
app.use("/api", require("./routes/apiRoutes")); // ecommerce endpoints
app.use("/contact", require("./routes/contactRoutes")); // mangage messages via email

// Swagger documentaion
const specs = swaggerJsDoc(swaggerOpt);
app.use("/api-docs", swaggerUI.serve, swaggerUI.setup(specs));

// Handle errors
app.all("*", notFound);
app.use(errorHandler);

// Init db & Run the server
sequelize.sync({alter: true}).then(() => {
  app.listen(PORT, () => {
    console.log(`server runing on port ${PORT}`);
  });
});

// Catch unhandled exceptions
process.on("uncaughtException", (err) => {
  console.error(`Uncaught Exception: ${err}`);
  process.exit(1);
});

// Catch unhandled promise rejections
process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
  process.exit(1);
});

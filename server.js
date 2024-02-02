import dotenv from "dotenv";
dotenv.config();
import express, { json, urlencoded } from "express";
const app = express();
import cors from "cors";
import cookieParser from "cookie-parser";
import corsOptions from "./config/corsOptions.js";
import { logger, logEvents } from "./middlewares/logger.js";
import notFound from "./middlewares/notFound.js";
import errorHandler from "./middlewares/errorHandler.js";
import { serve, setup } from "swagger-ui-express";
import swaggerJsDoc from "swagger-jsdoc";
import swaggerOpt from "./config/swaggerOpt.js";
import { sequelize } from "./models/index.js";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const PORT = process.env.PORT || 3500;

// Setup Useful Middlewares
app.use(logger); //log every request
app.use(cors(corsOptions)); //allow only specific origins
app.use(json()); //parse application/json
app.use(urlencoded({ extended: true })); //parse form data
app.use(cookieParser());

// Serve statatic files on specific path
app.use("/", express.static(join(__dirname, "uploads")));

app.get("/addproduct", (req, res) => {
  res.sendFile(join(__dirname + "/views" + "/addProduct.html"));
});

app.get("/addimage", (req, res) => {
  res.sendFile(join(__dirname + "/views" + "/addImage.html"));
});

// Import Routes
import route from "./routes/route.js";
import authRoutes from "./routes/authRoutes.js";
import apiRoutes from "./routes/apiRoutes.js";
import contactRoutes from "./routes/contactRoutes.js";

// Api routes
app.use("/", route); // api welcome page
app.use("/auth", authRoutes); // andle authentication
app.use("/api", apiRoutes); // ecommerce endpoints
app.use("/contact", contactRoutes); // mangage messages via email

// Swagger documentaion
const specs = swaggerJsDoc(swaggerOpt);
app.use("/api-docs", serve, setup(specs));

// Handle errors
app.all("*", notFound);
app.use(errorHandler);

// Init db & Run the server
sequelize.sync({ alter: true }).then(() => {
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

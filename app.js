const express = require("express");
const productRoutes = require("./routes/productRoutes.js");
const userRoutes = require("./routes/userRoutes.js");
const globalErrorHandlerMiddleware = require("./controllers/errorController.js");
const morgan = require("morgan");
const { default: helmet } = require("helmet");

const app = express();

// REQUIRED to make app to undrstand json from postman
app.use(express.json());

// Show URLS
app.use(morgan("dev"));

app.use(helmet());

app.use("/api/v1/products", productRoutes);
app.use("/api/v1/users", userRoutes);

app.use(globalErrorHandlerMiddleware);
module.exports = app;

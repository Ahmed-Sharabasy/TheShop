const express = require("express");
const productRoutes = require("./routes/productRoutes.js");
const globalErrorHandlerMiddleware = require("./controllers/errorController.js");

const app = express();

// REQUIRED to make app to undrstand json from postman
app.use(express.json());

app.use("/api/v1/products", productRoutes);

app.use(globalErrorHandlerMiddleware);
module.exports = app;

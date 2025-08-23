sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    error: err,
    Error_Stack: err.stack,
    status: err.status,
    message: err.message,
    from: "Iam from globalErrorHandler",
  });
};
sendErrorProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
      from: "Iam from globalErrorHandler",
    });
    // Programming Error  or error in 3rd party library or any thing we dont know
  } else {
    console.error(err);
    res.status(500).json({
      status: "error",
      message: "somthing went wrong!",
    });
  }
};

module.exports = (err, req, res, next) => {
  err.status = err.status || "error";
  err.statusCode = err.statusCode || 500;

  if (process.env.NODE_ENV === "development") {
    sendDevError(err, res);
  } else if (process.env.NODE_ENV === "production") {
    sendErrorProd(err, res);
  }
};

class ErrorHandler extends Error {
  // Extend the built-in Error class
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

export const errorMiddleware = (err, req, res, next) => {
  err.message = err.message || "Internal Server Error";
  err.statusCode = err.statusCode || 500;

  // Handle MongoDB duplicate key error
  if (err.code === 11000) {
    const message = `Duplicate ${Object.keys(err.keyValue)} entered`;
    err = new ErrorHandler(message, 400);
  }

  // Handle invalid JSON Web Token error
  if (err.name === "JsonWebTokenError") {
    const message = "JSON Web Token is invalid, try again";
    err = new ErrorHandler(message, 400);
  }

  // Handle expired JSON Web Token error
  if (err.name === "TokenExpiredError") {
    const message = "JSON Web Token has expired, try again";
    err = new ErrorHandler(message, 400);
  }

  // Handle Mongoose cast error it it type is string and u enter number ie cast error
  if (err.name === "CastError") {
    const message = `Invalid ${err.path}`;
    err = new ErrorHandler(message, 400);
  }

  const errorMessage = err.errors
    ? Object.values(err.errors)
        .map((error) => error.message)
        .join(" , ")
    : err.message;

  return res.status(err.statusCode).json({
    status: false,
    message: errorMessage,
  });
};

export default ErrorHandler;

import jwt from "jsonwebtoken";
import { catchAsyncError } from "./catchAsyncError.js";
import ErrorHandler from "./errorMiddleware.js";
import Admin from "../models/adminModel.js";
import User from "../models/userSchema.js";

// Middleware to check if the user is an authenticated admin
export const isAdminAuthenticated = catchAsyncError(async (req, res, next) => {
  // console.log("Cookies",req.cookies);
  const token = req.cookies.adminToken; // Accessing adminToken from the request cookies
  // Log the token for debugging
  // console.log("Admin Token: ", token);

  if (!token) {
    return next(new ErrorHandler("Admin is not Authenticated!", 401)); // Changed to 401 Unauthorized status
  }

  // Decode the token
  const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
  req.user = await Admin.findById(decoded.id);  

  if (!req.user) {
    return next(new ErrorHandler("Admin not found", 404));
  }

  // Check if the user is an admin
  if (req.user.role !== "Admin") {
    return next(new ErrorHandler("Not authorized for this resource", 403)); // Changed error message
  }

  // Proceed to the next middleware
  next();
});

export const isPatientAuthenticated = catchAsyncError(
  async (req, res, next) => {
    // console.log(req.cookies);
    const token = req.cookies.patientToken;
    // Log the token for debugging
    // console.log("Patient Token: ", token); 

    if (!token) {
      return next(new ErrorHandler("Patient is not authenticated", 401));
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    req.user = await User.findById(decoded.id);

    if (!req.user) {
      return next(new ErrorHandler("Patient not found", 404));
    }

    if (req.user.role !== "Patient") {
      return next(new ErrorHandler("Not authorized for this resource", 403));
    }

    next();
  }
);

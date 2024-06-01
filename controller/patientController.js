import User from "../models/userSchema.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwtToken.js";

export const registerPatient = catchAsyncError(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    password,
    dob,
    gender,
    phone,
    address,
    message,
    aadhar,
  } = req.body;

  // Check if all required fields are provided
  if (
    !firstName ||
    !lastName ||
    !email ||
    !password ||
    !dob ||
    !gender ||
    !phone ||
    !address ||
    !aadhar
  ) {
    return next(new ErrorHandler("Please fill out all required fields", 400));
  }

  // Check if patient is already registered
  const patientExists = await User.findOne({
    $or: [{ email }, { phone }, { aadhar }],
  });
  if (patientExists) {
    return next(
      new ErrorHandler(
        "User already exists with this email, phone, or aadhar number",
        400
      )
    );
  }

  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const patient = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    dob,
    gender,
    phone,
    address,
    aadhar,
    role: "Patient",
    message,
  });

  await patient.save();

  // Generate and send token
  generateToken(patient, "Patient registered successfully", 201, res);
});

export const loginPatient = catchAsyncError(async (req, res, next) => {
  const { phone, password } = req.body;

  // Check if phone and password are provided
  if (!phone || !password) {
    return next(
      new ErrorHandler("Please provide phone number and password", 400)
    );
  }

  // Check if patient exists with the provided phone number
  const patient = await User.findOne({phone });
  if (!patient) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  // if(patient.role !=="Patient"){
  //   return next(new ErrorHandler("Not authorized for this resource", 403));
  // }

  // Check password
  const isMatch = await bcrypt.compare(password, patient.password);
  if (!isMatch) {
    return next(new ErrorHandler("Invalid credentials", 401));
  }

  // Generate and send token
  generateToken(patient, "Login successful", 200, res);
});

export const getAllPatients = catchAsyncError(async (req, res, next) => {
  const allPatients = await User.find({ role: "Patient" });

  res.status(200).json({
    status: true,
    message: "Successfully fetched all patients",
    totalPatients: allPatients.length,
    patients: allPatients,
  });
});

export const logoutPatients = catchAsyncError(async (req, res, next) => {
  // Clear patientToken cookie
  res.cookie("patientToken", "", {
    httpOnly: true,
    expires: new Date(Date.now()),
  });
  res.status(200).json({
    status: true,
    message: "Successfully logged out",
  });
});

import Admin from "../models/adminModel.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwtToken.js";

export const adminRegister = catchAsyncError(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    dob,
    phone,
    aadhar,
    password,
    doctorDepartment,
    gender,
  } = req.body;

  if (
    !firstName ||
    !lastName ||
    !email ||
    !dob ||
    !phone ||
    !aadhar ||
    !password ||
    !gender ||
    !doctorDepartment
  ) {
    return next(new ErrorHandler("Please Fill Full Form", 400));
  }

  const existingAdmin = await Admin.findOne({ $or: [{ phone }, { email }] });
  if (existingAdmin) {
    return next(
      new ErrorHandler(
        `Admin Already Exists`,
        400
      )
    );
  }

  //hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  const admin = new Admin({
    firstName,
    lastName,
    email,
    dob,
    phone,
    aadhar,
    gender,
    password: hashedPassword,
    doctorDepartment,
    role: "Admin"
  });
  try {
    await admin.save();
    generateToken(admin, "Admin Registered Successfully", 200, res);
  } catch (error) {
    if (error.name === "ValidationError") {
      return next(new ErrorHandler(error.message, 400));
    }
    next(error);
  }
});

export const loginAdmin = catchAsyncError(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return next(new ErrorHandler("Please fill in all fields", 400));
  }

  const existingAdmin = await Admin.findOne({ email });
  if (!existingAdmin) {
    return next(new ErrorHandler("Invalid email or password", 400));
  }

  const isPasswordMatch = await bcrypt.compare(password, existingAdmin.password);
  if (!isPasswordMatch) {
    return next(new ErrorHandler("Invalid password", 400));
  }

  generateToken(existingAdmin, "Admin Login Successfully", 200, res);
});

export const getAllAdmin = catchAsyncError(async (req, res, next) => {
  try {
    const allAdmins = await Admin.find({});
    const totalAdmins = allAdmins.length
    res.status(200).json({ status: true, message: "Successfully retrieved all admins", totalAdmins, allAdmins, });
  } catch (error) {
    next(error);
  }
});

//logout admin
//removing cookie syntax is (cookie(cookieName,null,{httpOnly:true,expires:new Date(Date.now())}))
export const logoutAdmin = catchAsyncError(async (req, res, next) => {
  res.status(200).cookie("adminToken", "", {
    httpOnly: true,
    expires: new Date(Date.now())
  }).json({ status: true, message: "Successfully logged Out of Admin" })
})
import cloudinary from "cloudinary";
import Doctor from "../models/doctorModel.js";
import bcrypt from "bcrypt";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";

// Get all doctors
export const getAllDoctors = catchAsyncError(async (req, res) => {
  try {
    const doctors = await Doctor.find({ role: "Doctor" });
    const totalDoctors = doctors.length;
    res.status(200).json({
      status: true,
      message: "Successfully retrieved all doctors",
      totalDoctors,
      doctors,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

// Register a doctor
export const RegisterDoctor = catchAsyncError(async (req, res) => {
  try {
    // Check for avatar
    if (!req.files || !req.files.docAvatar) {
      return res.status(400).json({
        status: false,
        message: "Doctor Avatar is required",
      });
    }

    const { docAvatar } = req.files;
    const allowedFormats = [
      "image/jpg",
      "image/jpeg",
      "image/png",
      "image/gif",
      "image/webp",
      "image/svg+xml",
      "image/svg+xml+xml",
      "image/png+xml",
      "image/gif+xml",
    ];

    // Validate avatar format
    if (!allowedFormats.includes(docAvatar.mimetype)) {
      return res.status(400).json({
        status: false,
        message: "File format not allowed",
      });
    }

    const {
      firstName,
      lastName,
      email,
      dob,
      phone,
      aadhar,
      password,
      gender,
      doctorDepartment,
    } = req.body;

    // Check for required fields
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
      return res.status(400).json({
        status: false,
        message: "Admin! Please fill all fields to register Doctor",
      });
    }

    // Check if doctor already exists
    const existingDoctor = await Doctor.findOne({
      $or: [{ email }, { phone }, { aadhar }],
    });
    if (existingDoctor) {
      return res.status(200).json({
        status: false,
        message: "Admin! Doctor already exists with phone,email or aadhar",
      });
    }

    // Upload avatar to Cloudinary
    let cloudinaryResponse;
    try {
      cloudinaryResponse = await cloudinary.uploader.upload(
        docAvatar.tempFilePath
      );
    } catch (error) {
      console.error("Cloudinary Error: ", error);
      return res.status(500).json({
        status: false,
        message: "Failed to upload image to Cloudinary",
      });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(password, salt);

    // Create new doctor
    const doctor = new Doctor({
      firstName,
      lastName,
      email,
      dob,
      phone,
      aadhar,
      password: hashPassword,
      gender,
      doctorDepartment,
      role: "Doctor",
      docAvatar: {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      },
    });

    await doctor.save();
    res.status(200).json({
      status: true,
      message: "Doctor registered successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const deleteDoctor = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      return next(new ErrorHandler("Doctor ID is required", 400));
    }
    let doctor = await Doctor.findById(id);
    if (!doctor) {
      return next(new ErrorHandler("Doctor not found", 400));
    }
    doctor = await Doctor.findByIdAndDelete(id);
    res.status(200).json({
      status: true,
      message: "Doctor deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});

export const updateDoctor = catchAsyncError(async (req, res, next) => {
  const { id } = req.params;
  try {
    if (!id) {
      return next(new ErrorHandler("Doctor ID is required to Update", 400));
    }
    let doctor = await Doctor.findById(id);
    if (!doctor) {
      return next(new ErrorHandler("Doctor not found", 400));
    }


    // Update the doctor document
    doctor = await Doctor.findByIdAndUpdate(id,
      req.body, {
      new: true,
      runValidators: true,
      useFindAndModify: false,
    });

    res.status(200).json({
      status: true,
      message: "Doctor updated successfully",
      doctor,
    });
  } catch (error) {
    res.status(500).json({
      status: false,
      message: error.message,
    });
  }
});



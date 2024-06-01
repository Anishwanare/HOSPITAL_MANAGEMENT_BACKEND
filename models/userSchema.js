import mongoose from "mongoose";
import validator from "validator";

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [2, "First Name must contain at least 2 characters"],
    },
    lastName: {
      type: String,
      required: true,
      minLength: [2, "Last Name must contain at least 2 characters"],
    },
    dob: {
      type: String,
      required: [true, "Date of Birth is required"],
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["Male", "Female", "Other"],
    },
    email: {
      type: String,
      required: true,
      validate: [validator.isEmail, "Enter a valid email"],
    },
    phone: {
      type: String,
      required: true,
      validate: {
        validator: function (v) {
          return /^\d{10}$/.test(v); // Indian phone number validation (10 digits)
        },
        message: (props) =>
          `${props.value} is not a valid 10-digit Indian phone number`,
      },
    },
    address: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: false,
    },
    aadhar: {
      type: String,
      required: [true, "Aadhaar card number is required"],
      validate: {
        validator: function (v) {
          return /^\d{12}$/.test(v); // Aadhaar card number validation (12 digits)
        },
        message: (props) =>
          `${props.value} is not a valid 12-digit Aadhaar card number`,
      },
    },
    password: {
      type: String,
      required: true,
      minLength: [6, "Password must contain at least 6 characters"],
    },
    role: {
      type: String,
      required: true,
      enum: ["Patient", "Doctor", "Admin"],
      default:"Patient",
    },
    doctorDepartment: {
      type: String,
      required: false,
    },
    docAvatar: {
      public_id: String,
      url: String,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;

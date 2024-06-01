import mongoose from "mongoose";
import validator from "validator";

const appointmentSchema = new mongoose.Schema(
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
        message: (props) => `${props.value} is not a valid 10-digit Indian phone number`,
      },
    },
    dob: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: [true, "Gender is required"],
      enum: ["Male", "Female", "Other"],
    },
    address: {
      type: String,
      required: true,
    },
    message: {
      type: String,
      required: false,
    },
    appointmentDate: {
      type: String, // Consider changing to Date type for better validation
      required: true,
    },
    department: {
      type: String,
      required: false,
    },
    doctor: {
      firstName: {
        type: String,
        required: false,
      },
      lastName: {
        type: String,
        required: false,
      },
    },
    Visited: {
      type: Boolean,
      default: false,
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Doctor",
      required: false,
    },
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Patient",
      required: false,
    },
    status: {
      type: String,
      required: true,
      enum: ["Pending", "Accepted", "Rejected"],
      default: "Pending",
    },
  },
  { timestamps: true }
);

export const Appointment = mongoose.model("Appointment", appointmentSchema);

import mongoose from "mongoose";
import validator from "validator";

const messageSchema = new mongoose.Schema({
  firstName: {
    type: String,
    require: true,
    minLength: [2, "First Name Contain At Least 2 Character"],
  },
  lastName: {
    type: String,
    require: true,
    minLength: [2, "First Name Contain At Least 2 Character"],
  },
  email: {
    type: String,
    require: true,
    validate: [validator.isEmail, "Enter Valid Email"],
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
  message: {
    type: String,
    require: true,
    minLength: [2, "Message Must Contain Atleast 2 Character"],
  },
}, { timestamps: true });


export const Message = mongoose.model("message", messageSchema)
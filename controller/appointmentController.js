import Doctor from "../models/doctorModel.js";
import { Appointment } from "../models/appointmentModel.js";
import { catchAsyncError } from "../middlewares/catchAsyncError.js";
import ErrorHandler from "../middlewares/errorMiddleware.js";

export const appointments = catchAsyncError(async (req, res, next) => {
  const {
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    address,
    message,
    appointmentDate,
    department,
    doctorFirstName,
    doctorLastName,
    Visited,
  } = req.body;

  // console.log(req.body); // Debugging: Log the request body to check incoming data

  // Check if any required field is missing
  if (
    !firstName ||
    !lastName ||
    !email ||
    !phone ||
    !dob ||
    !gender ||
    !address ||
    !appointmentDate ||
    !department ||
    !doctorFirstName ||
    !doctorLastName
  ) {
    return next(
      new ErrorHandler("Please Fill Full Form To Submit Appointment", 400)
    );
  }

  // Check if doctor with given details exists
  const isConflict = await Doctor.find({
    $and: [
      { firstName: doctorFirstName },
      { lastName: doctorLastName },
      { doctorDepartment: department },
    ],
  });

  if (isConflict.length === 0) {
    return next(new ErrorHandler("Doctor With this Details not Found", 400));
  }

  // If more than one doctor found with same name and department
  if (isConflict.length > 1) {
    return next(
      new ErrorHandler(
        "Doctor Conflict! Please contact through email, phone, or Welcome! to Hospital",
        400
      )
    );
  }

  const doctorId = isConflict[0]._id;
  // const patientId = req.user._id; // Assuming user is authenticated

  // Create the appointment
  const appointment = new Appointment({
    firstName,
    lastName,
    email,
    phone,
    dob,
    gender,
    address,
    message,
    appointmentDate,
    department,
    doctor: {
      firstName: doctorFirstName,
      lastName: doctorLastName,
    },
    Visited,
    doctorId,
    // patientId,
  });

  // Save the appointment
  await appointment.save();
  res.status(200).json({
    status: true,
    message: "Appointment Sent Successfully",
  });
});

export const getAllAppointments = catchAsyncError(async (req, res, next) => {
  try {
    const allAppointments = await Appointment.find({});
    const totalAppointments = allAppointments.length;
    res.status(200).json({
      status: true,
      message: "Successfully get all appointments",
      totalAppointments,
      allAppointments,
    });
  } catch (error) {
    next(error);
  }
});

//update appointment status
export const updateAppointmentStatus = catchAsyncError(
  async (req, res, next) => {
    try {
      const { id: appointmentId } = req.params;

      //check id is selected in req.params
      if (!appointmentId) {
        return next(new ErrorHandler("Appointment ID is required", 400));
      }

      let appointment = await Appointment.findById(appointmentId);
      if (!appointment) {
        return next(new ErrorHandler("Appointment Not Found", 404));
      }

      //update the appointment
      appointment = await Appointment.findByIdAndUpdate(
        appointmentId,
        req.body,
        {
          new: true,
          runValidators: true,
          useFindAndModify: false,
        }
      );
      res.status(200).json({
        status: true,
        message: "Appointment Status Updated Successfully",
        appointment,
      });
    } catch (error) {
      next(error);
    }
  }
);

//delete appointment
export const deleteAppointment = catchAsyncError(async (req, res, next) => {
  try {
    const { id: appointmentId } = req.params;
    if (!appointmentId) {
      return next(new ErrorHandler("Appointment ID is required", 400));
    }
    let deleteAppointment = await Appointment.findById(appointmentId);
    if (!deleteAppointment) {
      return next(new ErrorHandler("Appointment Not Found", 404));
    }
    deleteAppointment = await Appointment.findByIdAndDelete(appointmentId);
    res.status(200).json({
      status: true,
      message: "Appointment Deleted Successfully",
    });
  } catch (error) {
    next(error);
  }
});

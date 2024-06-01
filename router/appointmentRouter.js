import express from "express";
import {
  appointments,
  deleteAppointment,
  getAllAppointments,
  updateAppointmentStatus,
} from "../controller/appointmentController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

router.post("/appointment",appointments);
router.get("/getappointment", getAllAppointments);
router.put("/update/status/:id", isAdminAuthenticated, updateAppointmentStatus);
router.delete(
  "/delete/appointment/:id",
  isAdminAuthenticated,
  deleteAppointment
);

export default router;

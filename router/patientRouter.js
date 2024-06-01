import express from "express";
import { registerPatient } from "../controller/patientController.js";
import { loginPatient } from "../controller/patientController.js";
import { getAllPatients } from "../controller/patientController.js";
import { logoutPatients } from "../controller/patientController.js";
import {
  isAdminAuthenticated,
  isPatientAuthenticated,
} from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", registerPatient);
router.post("/login", loginPatient);
router.get("/getAllPatients", getAllPatients);
router.get("/logout",logoutPatients);

export default router;

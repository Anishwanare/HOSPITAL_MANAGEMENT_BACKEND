import express from "express";
import { RegisterDoctor, deleteDoctor, getAllDoctors, updateDoctor } from "../controller/doctorController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";


const router = express.Router();

router.get("/getdoctors",getAllDoctors);
router.post("/register", isAdminAuthenticated,RegisterDoctor)
router.delete("/delete/:id", deleteDoctor)
router.put("/update/:id", updateDoctor) //not working properly

export default router;

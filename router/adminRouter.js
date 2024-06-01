import express from "express";
import { adminRegister, getAllAdmin, loginAdmin, logoutAdmin } from "../controller/adminController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/register", adminRegister)
router.post("/login", loginAdmin)
router.get("/getAllAdmins",getAllAdmin)
router.get("/logout", isAdminAuthenticated,logoutAdmin)

export default router;
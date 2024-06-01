import express from "express";
import {
  deleteMessages,
  getAllMessages,
  sendMessage,
} from "../controller/messageController.js";
import { isAdminAuthenticated } from "../middlewares/auth.js";

const router = express.Router();

router.post("/send", sendMessage);
router.get("/getmessage",getAllMessages);
router.delete("/deletemessages/:id",deleteMessages);

export default router;

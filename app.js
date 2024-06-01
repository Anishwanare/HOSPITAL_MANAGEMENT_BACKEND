import express from "express";
import { config } from "dotenv";
import cors from "cors";
import cookieParser from "cookie-parser";
import fileUpload from "express-fileupload"; //middleware for file upload 
import { dbConnection } from "./database/dbConnection.js";
import messageRouter from "./router/messageRouter.js";
import { errorMiddleware } from "./middlewares/errorMiddleware.js";
import patientRouter from "./router/patientRouter.js";
import adminRouter from "./router/adminRouter.js";
import doctorRouter from "./router/doctorRouter.js";
import appointmentRouter from "./router/appointmentRouter.js";

const app = express();
config({ path: "./config/config.env" });
app.use(
  cors({
    origin: [process.env.FRONTEND_URL],
    method: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// Middleware
app.use(cookieParser()); // using cookie parser we will get cookies
app.use(express.json()); // middleware to data into JSON
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({ useTempFiles: true, tempFileDir: "/tmp/" })); //middleware to upload files

// MongoDB connection
dbConnection();

// Router
app.use("/api/v1/message", messageRouter);
app.use("/api/v2/patients", patientRouter);
app.use("/api/v3/admin", adminRouter);
app.use("/api/v4/doctors", doctorRouter);
app.use("/api/v5/patient",appointmentRouter)

app.use(errorMiddleware); // always use at end
export default app;

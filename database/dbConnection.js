import mongoose from "mongoose";

export const dbConnection = () => {
  mongoose
    .connect(process.env.MONGO_URI, {
      dbName: "HOSPITAL_MANAGEMENT_SYSYTEM",
    })
    .then(() => {
      console.log("Connected to DataBase");
    })
    .catch((err) => {
      console.log(`some error while connecting to DB ${err}`);
    });
};

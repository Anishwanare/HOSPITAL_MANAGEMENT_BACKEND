import app from "./app.js";
import { v2 as cloudinary } from "cloudinary";

const PORT = 4010 || process.env.PORT;
app.get("/",(req,res)=>{
    res.send("hello world")
})

//cloudinary config from docmentation
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

app.listen(process.env.PORT,()=>{
    console.log("server is running at port ",PORT )
})
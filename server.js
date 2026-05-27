import express from "express";
import "dotenv/config";
import fileUpload from "express-fileupload"
import cors from "cors";
const app=express();
const PORT=process.env.PORT ||  8000;


app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(fileUpload());
app.use(cors());

app.get("/",(req,res)=>{
          res.json({success:true,message:"Prisma Testing"});
 })


 // Import routes

import ApiRoutes from "./routes/api.js";
app.use("/api",ApiRoutes);

app.listen(PORT,()=>{
    console.log(`Server is running on port ${PORT}`);
})


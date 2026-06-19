import express from "express";
import cors from "cors"
import dotenv from "dotenv";
import mongoose from "mongoose";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());    
app.get('/',(req,res)=>{
    res.json("Backend is running");

});

const PORT= (process.env.PORT);

mongoose.connect(process.env.MONGO_URI)
 .then(()=>{
    console.log("Connected to mongodb");
    app.listen(PORT,()=>{
    console.log(`Listening at ${PORT}`);
})
 }).catch (e=> console.log(e));
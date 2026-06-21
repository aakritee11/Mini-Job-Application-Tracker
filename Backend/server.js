import express from "express";
import cors from "cors"
import dotenv from "dotenv";
import mongoose from "mongoose";
import { router } from "./routes/application.js";

const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());   
app.use('/applications',router); 
app.get('/',(req,res)=>{
    res.json("Backend is running");

});
app.use((req,res)=>{
    res.json({message: 'Job Application Tracker API running'})
})

app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

const PORT= (process.env.PORT);

mongoose.connect(process.env.MONGO_URI)
 .then(()=>{
    console.log("Connected to mongodb");
    app.listen(PORT,()=>{
    console.log(`Listening at ${PORT}`);
})
 }).catch (e=> console.log(e));

 
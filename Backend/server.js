import express from "express";
import cors from "cors"
import dotenv from "dotenv";


const app = express();
dotenv.config();

app.use(cors());
app.use(express.json());    
app.get('/',(req,res)=>{
    res.json("Backend is running");

});

const PORT= (process.env.PORT);

app.listen(PORT,()=>{
    console.log(`Listening at ${PORT}`);
})
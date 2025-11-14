import express from 'express'
import "./cron/jobImport.Cron";
import jobRouter from './routes/jobImport.routes';
import { connectDb } from './config/db';
const app=express();
connectDb();
app.use(express.json());
app.use('/job',jobRouter);
const PORT=5000;
app.listen(PORT,()=>{
    console.log("we are up..! on " , PORT);
})

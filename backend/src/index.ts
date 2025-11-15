import dotenv from 'dotenv'
dotenv.config();
import express from 'express'
import './cron/jobimport.cron'
import './worker/jobimport.worker'
import jobRouter from './routes/jobImport.routes';
import { connectDb } from './config/db';

// import { JobImportQueue } from "./queues/jobImport.queue";

// JobImportQueue.add("test-job", { feedUrl: "https://google.com" });
console.log("Test job added");
const app=express();
connectDb();
app.use(express.json());
app.use('/job',jobRouter);
const PORT=5000;
app.listen(PORT,()=>{
    console.log("we are up..! on " , PORT);
})

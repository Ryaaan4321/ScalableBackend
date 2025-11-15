import dotenv from 'dotenv'
dotenv.config();
import express from 'express'
import './cron/jobImportCron'
import './worker/jobImportWorker'
import jobRouter from './routes/jobImport.routes';
import { connectDb } from './config/db';
import cors from "cors";


// import { JobImportQueue } from "./queues/jobImport.queue";

// JobImportQueue.add("test-job", { feedUrl: "https://google.com" });
console.log("Test job added");
const app=express();
app.use(cors({
    origin: "http://localhost:3000",
    methods: "GET,POST,PUT,PATCH,DELETE",
    credentials: true
}));
connectDb();
app.use(express.json());
app.use('/job',jobRouter);
const PORT=5000;
app.listen(PORT,()=>{
    console.log("we are up..! on " , PORT);
})

import { Worker } from "bullmq";
import { connectRedis } from "../config/redis";
import logger from "../logger";
import { JobImportService } from "../services/jobImport.Service";
import importLogModel from "../model/importLog.model";
import { connectDb } from "../config/db";
connectDb();
const worker=new Worker("job-import-queue",async(job)=>{
    console.log("CRON TRIGGERED");
    const feedUrl=job.data.feedUrl;
    console.log("FEED URL RECEIVED IN WORKER =", feedUrl);
    logger.info("worker is processing the jobs");
    const service=new JobImportService();
    const result=await service.fetchAndImport(feedUrl);
    console.log("result = ",result);
    await importLogModel.create({
        feedUrl,
        totalFetched:result.totalFetched,
        failedJobs:result.failedJobs,
        updatedJobs:result.updatedJobs,
        newJobs:result.newJobs,
        timestamp:result.timeStamp,
        totalImported:result.totalImported
    })
    logger.debug({"result = ":result});
    return result;
},{
  connection: connectRedis,
  concurrency: 5
});
worker.on("completed",(job)=>{
    logger.info(`Job completed for feed :${job.data.feedUrl}`);
})
worker.on("failed",(job,err)=>{
    logger.warn(`Job failed for the feed : ${err.message}`)
});

// redis-cli --tls -h discrete-elephant-15412.upstash.io -p 6379 -a "PASSWORD" keys "bull:job-import-queue:*"

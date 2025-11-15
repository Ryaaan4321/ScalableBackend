import { Worker } from "bullmq";
import { connectRedis } from "../config/redis";
import logger from "../logger";
import { JobImportService } from "../services/jobImport.Service";
import importLogModel from "../model/importLog.model";

const workder=new Worker("job-import-queue",async(job)=>{
    const feedUrl=job.data;
    logger.info("worker is processing the jobs");
    const service=new JobImportService();
    const result=await service.fetchAndImport(feedUrl);
    await importLogModel.create({
        feedUrl,
        totalFetched:result.totalFetched,
        failedJobs:result.failedJobs,
        
        
    })
})
import { Worker } from "bullmq";
import { connectRedis } from "../config/redis";
import logger from "../logger";
import { JobImportService } from "../services/jobImport.Service";
import importLogModel from "../model/importLog.model";
import { connectDb } from "../config/db";
connectDb();
import { getIO } from "../socket";
const worker = new Worker("job-import-queue", async (job) => {
    console.log("CRON TRIGGERED");
    const feedUrl = job.data.feedUrl;
    console.log("FEED URL RECEIVED IN WORKER =", feedUrl);
    logger.info("worker is processing the jobs");
    const service = new JobImportService();
    const result = await service.fetchAndImport(feedUrl);
    console.log("result = ", result);
    await importLogModel.create({
        feedUrl,
        totalFetched: result.totalFetched,
        failedJobs: result.failedJobs,
        updatedJobs: result.updatedJobs,
        newJobs: result.newJobs,
        timestamp: result.timeStamp,
        totalImported: result.totalImported
    })
    logger.debug({ "result = ": result });
    return result;
}, {
    connection: connectRedis,
    concurrency: Number(process.env.JOB_MAX_CONCURRENCY || 3)
});
worker.on("active", (job) => {
    getIO().emit("import:started", {
        feedUrl: job.data.feedUrl
    });
});
worker.on("completed", (job, result) => {
    logger.info(`Job completed for feed :${job.data.feedUrl}`);
    getIO().emit("import:completed", {
        feedUrl: job.data.feedUrl,
        ...result
    });
})
worker.on("failed", (job, err) => {
    getIO().emit("import:failed", {
        feedUrl: job?.data?.feedUrl,
        error: err.message
    });
    logger.warn(`Job failed for the feed : ${err.message}`)
});

// redis-cli --tls -h discrete-elephant-15412.upstash.io -p 6379 -a "PASSWORD" keys "bull:job-import-queue:*"

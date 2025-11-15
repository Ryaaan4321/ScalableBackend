import { Queue } from "bullmq";
import { connectRedis } from "../config/redis";

export const JobImportQueue=new Queue("job-import-queue",connectRedis);

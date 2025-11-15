import IORedis from "ioredis";

export const connectRedis = new IORedis(process.env.UPSTASH_REDIS_URL!, {
  maxRetriesPerRequest: null,
  enableReadyCheck: false
});

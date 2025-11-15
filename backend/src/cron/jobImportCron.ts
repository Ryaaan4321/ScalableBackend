import cron from 'node-cron'
import logger from '../logger'
import { JobImportService } from '../services/jobImport.Service';
import { JobImportQueue } from '../queues/jobImport.queue';
const jobService = new JobImportService();
logger.debug("heelo heelooooooooo froom the job importttttttt");
const FEEDS = [
    "https://www.higheredjobs.com/rss/articleFeed.cfm",
    "https://jobicy.com/?feed=job_feed&job_categories=management",
    "https://jobicy.com/?feed=job_feed&job_categories=business",
    "https://jobicy.com/?feed=job_feed&job_categories=copywriting",
    "https://jobicy.com/?feed=job_feed&job_categories=design-multimedia",
    "https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france",
    "https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time",
    "https://jobicy.com/?feed=job_feed",
    "https://jobicy.com/?feed=job_feed&job_categories=data-science"
]
console.log("CRON FILE LOADED");
cron.schedule("0 * * * *", async () => {
    logger.info("we are inside the schedule");

    for (const url of FEEDS) {
        console.log("ADDING JOB:", url);
        await JobImportQueue.add("import-job", { feedUrl: url });
        logger.info(`Loaded feed: ${url}`);
    }
});



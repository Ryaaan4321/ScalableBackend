import cron from 'node-cron'
import logger from '../loggert'
import { JobImportService } from '../services/jobImport.Service'
const jobService=new JobImportService();
logger.debug("heelo heelooooooooo froom the job importttttttt");
const FEEDS=[
    "https://www.higheredjobs.com/rss/articleFeed.cfm",
    "https://jobicy.com/?feed=job_feed&job_categories=management",
    "https://jobicy.com/?feed=job_feed&job_categories=business",
    "https://jobicy.com/?feed=job_feed&job_categories=copywriting",
    "https://jobicy.com/?feed=job_feed&job_categories=data-science",
    "https://jobicy.com/?feed=job_feed&job_categories=design-multimedia",
    "https://jobicy.com/?feed=job_feed&job_categories=seller&job_types=full-time&search_region=france",
    "https://jobicy.com/?feed=job_feed&job_categories=smm&job_types=full-time",
    "https://jobicy.com/?feed=job_feed"
]
cron.schedule("0 * * * * ",async()=>{
    logger.info("we are inside the schedule");
    for(const url of FEEDS){
        const result=await jobService.fetchAndImport(url);
        logger.debug(result);
    }
})


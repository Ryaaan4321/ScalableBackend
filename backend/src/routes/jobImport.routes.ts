import express from 'express'
import { JobImportService } from '../services/jobImport.Service';
import logger from '../loggert';

const jobRouter=express.Router();
jobRouter.post('/import',async(req,res)=>{
    const service=new JobImportService();
    const result=await service.fetchAndImport(req.body.url);
    // logger.debug(result);
    return res.json(result);
})
export default jobRouter;
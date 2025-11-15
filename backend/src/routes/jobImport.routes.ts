import express from 'express'
import importLogModel from '../model/importLog.model';
const jobRouter = express.Router();
console.log("job router got calllllllllllllll")
jobRouter.get('/import', async (req, res) => {
    try {
        const page = parseInt((req.query.page as string) || "1", 10);
        const limit = parseInt((req.query.limit as string) || "20", 10);
        const skip = (page - 1) * limit;
        const [logs, total] = await Promise.all([
            importLogModel
                .find()
                .sort({ timestamp: -1 })
                .skip(skip)
                .limit(limit)
                .lean(),
            importLogModel.countDocuments(),
        ]);
        return res.json({
            data: logs.map((log) => ({
                id: log._id,
                fileName: log.feedUrl,
                total: log.totalImported,
                new: log.newJobs,
                updated: log.updatedJobs,
                failed: log.failedJobs,
                timestamp: log.timestamp,
            })),
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
        });
    } catch (err: any) {
        console.error(err);
        return res.status(500).json({ message: "failed to fetch import logs" });
    }
});

export default jobRouter;
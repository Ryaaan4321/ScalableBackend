import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import jobModel from "../model/job.model";
import logger from "../loggert";

export class JobImportService {
    async fetchAndImport(feedUrl: string) {
        try {
            const xml = await this.fetchFeed(feedUrl);
            const feed = await this.parseXml(xml);
            const items = feed?.rss?.channel?.[0]?.item ?? [];
            let count = 0;
            for (const it of items) {
                const job = this.mapRSSItems(it);
                await jobModel.updateOne(
                    {
                        link: job.link || "",
                    },
                    {
                        $set: job
                    },
                    {
                        upsert: true
                    }
                )
                count++;
                logger.debug(count);
                return { count };
            }
        } catch (e: any) {
            logger.error("there is an error in the fetchAndImport Method");

        }
    }
    private async fetchFeed(url: string) {
        try {
            const response = await axios.get(url);
            logger.info({ response });
            return response.data;
        } catch (e: any) {
            logger.error("there is an error in the fetching the fetchFeed Method");
        }
    }
    private async parseXml(xml: string) {
        try {
            const parser = new XMLParser({ ignoreAttributes: true });
            const parsedData = parser.parse(xml);
            logger.debug(parsedData);
            return parsedData;
        } catch (e) {
            logger.error("there is an error in the parseXML method");
        }
    }
    private mapRSSItems(item: any) {
        try {
            logger.debug(item);
            return {
                title: item.title?.[0] || "",
                description: item.description?.[0] || "",
                link: item.link?.[0],
                pubDate: new Date(item.pubDate?.[0]) || new Date(),
                company: this.extractCompany(item),
                createdAt: new Date(),
                updatedAt: new Date(),
            }
        } catch (e) {
            logger.error("there is an error in the mapRSSItems Method");
        }
    }
    private extractCompany(item: any) {
        return (
            item["https://jobicy.com/company"]?.[0] ||
            item["company"]?.[0] ||
            "Unknown"
        );
    }
}
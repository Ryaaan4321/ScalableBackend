import axios from "axios";
import { XMLParser } from "fast-xml-parser";
import jobModel from "../model/job.model";
import logger from "../loggert";

logger.info("inside the job importservice got callledd");
export class JobImportService {
    async fetchAndImport(feedUrl: string) {
        logger.info("fetch and import method got calledd");
        try {
            const xml = await this.fetchFeed(feedUrl);
            const feed = await this.parseXml(xml);
            const items = feed?.rss?.channel?.item ?? [];

            // logger.info("items inforrrmation  =  ",items);
            let count = 0;
            for (const it of items) {
                const normalized = this.normalizeItem(it);
                logger.info(normalized);
                if (!normalized.externalId) {
                    logger.warn("skipping the item: missing externaliid", normalized);
                    continue;
                }
                await jobModel.updateOne(
                    { externalId: normalized.externalId },
                    { $set: normalized },
                    { upsert: true }
                );
            }
            return { count };

        } catch (e: any) {
            logger.error(e.message || e);
            logger.error(e.stack);
        }

    }
    private async fetchFeed(url: string) {
        try {
            logger.info("fetch feed method got callled");
            const response = await axios.get(url);
            return response.data;
        } catch (e: any) {
            logger.error("there is an error in the fetching the fetchFeed Method");
        }
    }
    private async parseXml(xml: string) {
        logger.info({ msg: "parse xml got calleddddd" });
        try {
            const parser = new XMLParser({ ignoreAttributes: true });
            const parsedData = parser.parse(xml);
            // logger.info({msg:"data come from the parsexml"});
            // logger.info({msg:parsedData});
            return parsedData;
        } catch (e) {
            logger.error("there is an error in the parseXML method");
        }
    }
    private mapRSSItems(item: any) {
        try {
            // logger.info("publish date = ",pub);
            logger.info("item argument === ", item);
            const pub = item.pubDate;
            logger.info("publish date = ", pub);
            const parsed = pub ? new Date(pub) : null;
            const extId = this.extractText(item.guid)
                || this.extractText(item.link);
            logger.info("extid ===== ", extId);
            if (!extId) {
                logger.error("Skipping item because no externalId found", item);
                return null;
            }
            return {
                externalId: extId,
                title: item.title || "",
                description: item.description || "",
                link: item.link || "",
                pubDate: parsed && !isNaN(parsed.getTime()) ? parsed : null,
                company: this.extractCompany(item),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
        } catch (e) {
            logger.error("mapRSSItems error:", e);
        }
    }
    private normalizeItem(item: any) {
        return {
            externalId:
                this.extractText(item.guid) ||
                this.extractText(item.id) ||
                this.extractText(item.link),

            title:
                this.extractText(item.title) ||
                this.extractText(item["job_listing:position"]) ||
                "",

            description:
                this.extractHTML(item["content:encoded"]) ||
                this.extractText(item.description) ||
                "",

            company:
                this.extractText(item["job_listing:company"]) ||
                this.extractText(item.company) ||
                "Unknown",

            location:
                this.extractText(item["job_listing:location"]) ||
                this.extractText(item.location) ||
                "",

            link:
                this.extractText(item.link) ||
                "",

            pubDate: this.safeDate(item.pubDate),
        };
    }
    private safeDate(value: any): Date | null {
        if (!value) return null;

        const d = new Date(value);
        return isNaN(d.getTime()) ? null : d;
    }
    private extractText(field: any): string | null {
        if (!field) return null;

        if (typeof field === "string") return field.trim();

        if (Array.isArray(field)) {
            field = field[0];
            if (typeof field === "string") return field.trim();
        }

        if (typeof field === "object") {
            return (
                field["#text"]?.trim() ||
                field["_text"]?.trim() ||
                field["$text"]?.trim() ||
                null
            );
        }

        return null;
    }
    private extractHTML(field: any): string | null {
        if (!field) return null;
        if (typeof field === "string") return field;

        if (typeof field === "object") {
            return field["#text"] || field["_text"] || null;
        }
        return null;
    }
    private extractCompany(item: any) {
        return (
            item["https://jobicy.com/company"]?.[0] ||
            item["company"]?.[0] ||
            "Unknown"
        );
    }
}
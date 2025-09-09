import { CronJob } from "cron";
import https from "https";
import { logger } from "./logger.js";
import { API_URL, VERSION } from "../config/default.js";
export const cronJob = new CronJob("*/14 * * * *", () => {
    https.get(`${API_URL}/api/${VERSION}/health`, (res) => {
        res
            .on("end", () => {
            if (res.statusCode === 200) {
                logger.info("✅ Cron job health check successful");
            }
            else {
                logger.warn("⚠️ Health check returned non-200 status");
            }
        })
            .on("error", (err) => {
            logger.error("❌ Cron job health check failed");
        });
    });
});

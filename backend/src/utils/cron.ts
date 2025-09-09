import { CronJob } from "cron";
import https from "https";
import { logger } from "./logger.js";
import { API_URL, VERSION } from "../config/default.js";

export const cronJob = new CronJob("*/14 * * * *", function () {
  https
    .get(`${API_URL}/api/${VERSION}/health`, (res) => {
      if (res.statusCode === 200) {
        logger.info("Cron job executed successfully ✅");
      } else {
        logger.error("Cron job failed ❌");
      }
    })
    .on("error", (error) => {
      logger.error(`Cron job failed: ${error.message} ❌`);
    });
});

import "dotenv";
import { testDb } from "./db/index.js";

import createServer from "./createServer.js";
import { logger } from "./utils/logger.js";
import { API_URL, PORT } from "./config/default.js";

const app = createServer();

app.listen(PORT, async () => {
  try {
    await testDb();
  } catch (error) {
    logger.error("Error connecting to the database: " + error);
    process.exit(1);
  }
  logger.info(`Backend running on ${API_URL}:${PORT}`);
});

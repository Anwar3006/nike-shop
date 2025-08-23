import "dotenv";
import { db, testDb } from "./db";
import { products } from "./schema";

import createServer from "./createServer";
import { logger } from "./utils/logger";
import { PORT } from "./config/default";

const app = createServer();

// app.get("/api/products", async (req, res) => {
//   const result = await db.select().from(products);
//   res.json(result);
// });

app.listen(PORT, async () => {
  try {
    await testDb();
  } catch (error) {
    logger.error("Error connecting to the database: " + error);
    process.exit(1);
  }
  logger.info(`Backend running on http://localhost:${PORT}`);
});

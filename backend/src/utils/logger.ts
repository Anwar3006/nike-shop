import dayjs from "dayjs";
import pino from "pino";

import { NODE_ENV } from "../config/default.js";

const isTest = NODE_ENV === "test";

export const logger = pino({
  // Avoid starting a worker thread in tests
  ...(isTest
    ? {}
    : {
        transport: {
          target: "pino-pretty",
          options: {
            colorize: true,
          },
        },
      }),
  base: {
    pid: false,
  },
  timestamp: () => `,"time":"${dayjs().format()}"`,
});

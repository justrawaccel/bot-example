import pino from "pino";
import { env } from "../app/config/env";

export const logger = pino({
  level: env.LOG_LEVEL,
  base: {
    pid: process.pid,
  },
  timestamp: pino.stdTimeFunctions.isoTime,
  transport:
    env.NODE_ENV === "development"
      ? {
          target: "pino-pretty",
          options: {
            colorize: true,
            levelFirst: true,
            translateTime: "HH:MM:ss.l",
            ignore: "hostname",
            singleLine: false,
            messageFormat: "{msg}",
          },
        }
      : undefined,
});

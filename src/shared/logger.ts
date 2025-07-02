import winston from "winston";
import { logs, SeverityNumber } from "@opentelemetry/api-logs";

const loggerProvider = logs.getLoggerProvider();
const otelLogger = loggerProvider.getLogger("default");

const winstonLogger = winston.createLogger({
  level: "info",
  format: winston.format.combine(
    winston.format.timestamp(),
    winston.format.json(),
  ),
  transports: [
    new winston.transports.Console(),
    new winston.transports.File({ filename: "logs/combined.log" }),
  ],
});

export const logger = {
  info: (message: string, metadata?: Record<string, string>) => {
    winstonLogger.info(message, metadata);
    otelLogger.emit({
      severityNumber: SeverityNumber.INFO,
      severityText: "INFO",
      body: message,
      attributes: metadata,
    });
  },
  error: (message: string, metadata?: Record<string, string>) => {
    winstonLogger.error(message, metadata);
    otelLogger.emit({
      severityNumber: SeverityNumber.ERROR,
      severityText: "ERROR",
      body: message,
      attributes: metadata,
    });
  },
  warn: (message: string, metadata?: Record<string, string>) => {
    winstonLogger.warn(message, metadata);
    otelLogger.emit({
      severityNumber: SeverityNumber.WARN,
      severityText: "WARN",
      body: message,
      attributes: metadata,
    });
  },
};

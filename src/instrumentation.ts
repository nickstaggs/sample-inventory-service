import { getNodeAutoInstrumentations } from "@opentelemetry/auto-instrumentations-node";
const instrumentations = getNodeAutoInstrumentations({
  "@opentelemetry/instrumentation-express": {
    requestHook: (span, request) => {
      span.setAttribute(
        "http.request.headers",
        JSON.stringify(request.request.headers),
      );
    },
  },
});

import { NodeSDK } from "@opentelemetry/sdk-node";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-grpc";
import { Resource } from "@opentelemetry/resources";
import { SemanticResourceAttributes } from "@opentelemetry/semantic-conventions";
import { diag, DiagConsoleLogger, DiagLogLevel } from "@opentelemetry/api";
import { logger } from "./shared/logger";

diag.setLogger(new DiagConsoleLogger(), DiagLogLevel.INFO);

const traceExporter = new OTLPTraceExporter({
  url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT || "http://otel-collector:4317",
});

try {
  new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: process.env.OTEL_SERVICE_NAME,
    }),
    traceExporter,
    instrumentations: [instrumentations],
  }).start();
} catch (error) {
  if (error instanceof Error) {
    logger.error(error.message);
  } else {
    logger.error(`Something went wrong setting up instrumentation. ${error}`);
  }
}

import { Metric } from "web-vitals";
import { logWebVitalsToFile } from "./logger";

// Function to send metrics to analytics
function sendToAnalytics(metric: Metric) {
  // Send to analytics endpoint
  const body = JSON.stringify(metric);
  const url = "/api/analytics";

  // Use `navigator.sendBeacon()` if available, falling back to `fetch()`.
  if (navigator.sendBeacon) {
    navigator.sendBeacon(url, body);
  } else {
    fetch(url, {
      body,
      method: "POST",
      keepalive: true,
      headers: {
        "Content-Type": "application/json",
      },
    }).catch(console.error);
  }
}

export function reportWebVitals(metric: Metric) {
  // Log to file with daily rotation
  logWebVitalsToFile(metric);

  sendToAnalytics(metric);
}

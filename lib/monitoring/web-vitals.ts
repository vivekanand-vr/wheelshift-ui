import { Metric } from "web-vitals";

// Function to send metrics to analytics
function sendToAnalytics(metric: Metric) {
  // Log to console in development
  if (process.env.NODE_ENV === "development") {
    console.log(metric);
  }

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
  // Core Web Vitals
  switch (metric.name) {
    case "CLS": // Cumulative Layout Shift
      console.log("CLS:", metric.value);
      break;
    case "FCP": // First Contentful Paint
      console.log("FCP:", metric.value);
      break;
    case "LCP": // Largest Contentful Paint
      console.log("LCP:", metric.value);
      break;
    case "TTFB": // Time to First Byte
      console.log("TTFB:", metric.value);
      break;
    case "INP": // Interaction to Next Paint
      console.log("INP:", metric.value);
      break;
    default:
      break;
  }

  sendToAnalytics(metric);
}

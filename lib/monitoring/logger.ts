import { Metric } from "web-vitals";

/**
 * Formats the current date as YYYY-MM-DD for daily log file names
 */
function getDateString(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const day = String(now.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/**
 * Formats the current timestamp for log entries
 */
function getTimestamp(): string {
  return new Date().toISOString();
}

/**
 * Logs web vitals metrics to daily log files in the logs folder
 */
export async function logWebVitalsToFile(metric: Metric) {
  try {
    const dateString = getDateString();
    const timestamp = getTimestamp();

    const logEntry = {
      timestamp,
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
    };

    // Send to API endpoint that will write to file
    await fetch("/api/logs/web-vitals", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        date: dateString,
        entry: logEntry,
      }),
    }).catch(console.error);
  } catch (error) {
    console.error("Error logging web vitals:", error);
  }
}

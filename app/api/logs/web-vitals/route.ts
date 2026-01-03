import { NextRequest, NextResponse } from "next/server";
import { promises as fs } from "fs";
import path from "path";

export async function POST(request: NextRequest) {
  try {
    const { date, entry } = await request.json();

    // Define logs directory path
    const logsDir = path.join(process.cwd(), "logs");
    const logFilePath = path.join(logsDir, `web-vitals-${date}.log`);

    // Ensure logs directory exists
    try {
      await fs.access(logsDir);
    } catch {
      await fs.mkdir(logsDir, { recursive: true });
    }

    // Format log entry as a single line JSON
    const logLine = JSON.stringify(entry) + "\n";

    // Append to log file
    await fs.appendFile(logFilePath, logLine, "utf-8");

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error("Error writing web vitals log:", error);
    return NextResponse.json({ error: "Failed to write log" }, { status: 500 });
  }
}

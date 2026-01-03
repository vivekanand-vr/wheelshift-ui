import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const metric = await request.json();
    console.log("Received web vital metric:", metric);
    // Here you can send metrics to your analytics service
    // Examples: Google Analytics, Vercel Analytics, DataDog, etc.
    // await sendToAnalyticsService(metric);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing web vital:", error);
    return NextResponse.json(
      { error: "Failed to process metric" },
      { status: 500 }
    );
  }
}

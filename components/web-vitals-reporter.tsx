"use client";

import { useEffect } from "react";
import { onCLS, onFCP, onLCP, onTTFB, onINP } from "web-vitals";
import { reportWebVitals } from "@/lib/monitoring/web-vitals";

export function WebVitalsReporter() {
  useEffect(() => {
    onCLS(reportWebVitals);
    onFCP(reportWebVitals);
    onLCP(reportWebVitals);
    onTTFB(reportWebVitals);
    onINP(reportWebVitals);
  }, []);

  return null;
}

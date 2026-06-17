"use client";

import { useState } from "react";

interface DebugPayload {
  originalCode: string;
  errorMessage?: string;
  language: string;
}

interface DebugResult {
  rootCause: string;
  errorType: string;
  severity: "low" | "medium" | "high" | "critical";
  affectedLines: number[];
  explanation: string;
  suggestedApproach: string;
}

interface FixResult {
  fixedCode: string;
  explanation: string;
  changedLines: number[];
  confidence: number;
}

interface CombinedAgentResponse {
  analysis: DebugResult;
  fix: FixResult;
}

export function useDebug() {
  const [loading, setLoading] = useState<boolean>(false);
  const [data, setData] = useState<CombinedAgentResponse | null>(null);

  const analyzeAndFix = async (payload: DebugPayload) => {
    setLoading(true);
    setData(null);

    try {
      const response = await fetch("http://localhost:8000/api/fix", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorText = await response.text();

        console.error(`[API Error] Status ${response.status}:`, errorText);

        throw new Error(
          `Backend server responded with status: ${response.status}`,
        );
      }

      const json = await response.json();

      if (json.success && json.data) {
        setData(json.data);

        const historyItem = {
          id: Date.now(),
          language: payload.language,
          code: payload.originalCode,
          errorLog: payload.errorMessage || json.data.analysis?.rootCause || "",
          createdAt: new Date().toLocaleString(),
        };

        const existingHistory = JSON.parse(
          localStorage.getItem("probe_history") || "[]",
        );

        existingHistory.unshift(historyItem);

        localStorage.setItem("probe_history", JSON.stringify(existingHistory));
      } else {
        setData(json);

        const historyItem = {
          id: Date.now(),
          language: payload.language,
          code: payload.originalCode,
          errorLog: payload.errorMessage || "",
          createdAt: new Date().toLocaleString(),
        };

        const existingHistory = JSON.parse(
          localStorage.getItem("probe_history") || "[]",
        );

        existingHistory.unshift(historyItem);

        localStorage.setItem("probe_history", JSON.stringify(existingHistory));
      }
    } catch (error) {
      console.error("[useDebug Hook Error]:", error);
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    data,
    analyzeAndFix,
  };
}

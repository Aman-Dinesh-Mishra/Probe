"use client";

import { useState } from "react";
import { generateFix } from "@/services/api";

export function useDebug() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any>(null);

  const analyzeAndFix = async (payload: any) => {
    setLoading(true);
    setData(null);

    try {
      const response = await generateFix(payload);

      const result = response.data || response;

      setData(result);

      const history = JSON.parse(localStorage.getItem("probe_history") || "[]");

      history.unshift({
        id: Date.now(),
        language: payload.language,
        code: payload.code,
        errorLog: payload.errorLog || payload.error || "",
        createdAt: new Date().toLocaleString(),
      });

      localStorage.setItem("probe_history", JSON.stringify(history));
    } catch (error) {
      console.error("[useDebug]", error);
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

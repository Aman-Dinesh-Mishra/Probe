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

      setData(response.data || response);
    } catch (error) {
      console.error("[useDebug]", error);
    } finally {
      setLoading(false);
    }
  };

  return { loading, data, analyzeAndFix };
}

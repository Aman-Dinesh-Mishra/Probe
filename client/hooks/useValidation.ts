"use client";

import { useState } from "react";
import { validateFix } from "@/services/api";

export function useValidation() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const validate = async (payload: any) => {
    setLoading(true);
    setResult(null);

    try {
      const response = await validateFix(payload);

      setResult(response.data || response);
    } catch (error: any) {
      setResult({
        passed: false,
        message: error?.message || "Validation failed",
      });
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    result,
    validate,
  };
}

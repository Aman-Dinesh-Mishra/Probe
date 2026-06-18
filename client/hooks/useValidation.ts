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

      const validationResult = response.data || response;

      setResult(validationResult);

      const validations = JSON.parse(
        localStorage.getItem("probe_validations") || "[]",
      );

      validations.unshift({
        id: Date.now(),
        language: payload.language,
        success: validationResult?.passed ?? validationResult?.success ?? false,
        output:
          validationResult?.output ?? validationResult?.message ?? "No output",
        createdAt: new Date().toLocaleString(),
      });

      localStorage.setItem("probe_validations", JSON.stringify(validations));
    } catch (error: any) {
      const failedResult = {
        passed: false,
        message: error?.message || "Validation failed",
      };

      setResult(failedResult);

      const validations = JSON.parse(
        localStorage.getItem("probe_validations") || "[]",
      );

      validations.unshift({
        id: Date.now(),
        language: payload.language,
        success: false,
        output: failedResult.message,
        createdAt: new Date().toLocaleString(),
      });

      localStorage.setItem("probe_validations", JSON.stringify(validations));
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

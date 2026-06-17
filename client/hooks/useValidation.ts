"use client";

import { useState } from "react";

interface FailureDetail {
  name: string;
  message: string;
}

export interface ValidationResult {
  success: boolean;
  message?: string;
  stdout?: string;
  stderr?: string;
  passed: boolean;
  totalTests: number;
  passed_count: number;
  failed_count: number;
  failures: FailureDetail[];
}

interface ValidationPayload {
  buggyCode: string;
  fixedCode: string;
  language: string;
}

export function useValidation() {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ValidationResult | null>(null);

  const validate = async (payload: ValidationPayload) => {
    setLoading(true);
    setResult(null);

    try {
      console.log("[Validation Request]", payload);

      const response = await fetch("http://localhost:8000/api/validate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const text = await response.text();
      console.log("[Validation Raw Response]", text);

      let data: any;

      try {
        data = text ? JSON.parse(text) : {};
      } catch {
        throw new Error("Invalid JSON response from server");
      }

      if (!response.ok) {
        throw new Error(data?.message || `Server returned ${response.status}`);
      }

      const validationResult = data.success && data.data ? data.data : data;

      setResult(validationResult);

      const validationItem = {
        id: Date.now(),
        language: payload.language,
        success: validationResult.passed ?? false,
        output:
          validationResult.stdout ||
          validationResult.message ||
          validationResult.stderr ||
          (validationResult.failures?.length
            ? validationResult.failures
                .map(
                  (failure: FailureDetail) =>
                    `${failure.name}: ${failure.message}`,
                )
                .join("\n")
            : "Validation completed"),
        createdAt: new Date().toLocaleString(),
      };

      const existingValidations = JSON.parse(
        localStorage.getItem("probe_validations") || "[]",
      );

      existingValidations.unshift(validationItem);

      localStorage.setItem(
        "probe_validations",
        JSON.stringify(existingValidations),
      );

      window.dispatchEvent(new Event("storage-update"));
    } catch (error: any) {
      console.error("[useValidation Hook Error]", error);

      const failedResult: ValidationResult = {
        success: false,
        passed: false,
        totalTests: 1,
        passed_count: 0,
        failed_count: 1,
        failures: [
          {
            name: "Validation API Error",
            message: error?.message || "Unexpected server failure",
          },
        ],
      };

      setResult(failedResult);

      const validationItem = {
        id: Date.now(),
        language: payload.language,
        success: false,
        output: error?.message || "Unexpected server failure",
        createdAt: new Date().toLocaleString(),
      };

      const existingValidations = JSON.parse(
        localStorage.getItem("probe_validations") || "[]",
      );

      existingValidations.unshift(validationItem);

      localStorage.setItem(
        "probe_validations",
        JSON.stringify(existingValidations),
      );

      window.dispatchEvent(new Event("storage-update"));
    } finally {
      setLoading(false);
    }
  };

  return {
    passed: result?.passed ?? false,
    result,
    loading,
    validate,
  };
}

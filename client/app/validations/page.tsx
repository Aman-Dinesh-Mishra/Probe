"use client";

import { useEffect, useState } from "react";

import DashboardShell from "@/components/dashboard/DashboardShell";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ValidationItem {
  id: number;
  language: string;
  success: boolean;
  output: string;
  createdAt: string;
}

export default function ValidationsPage() {
  const [validations, setValidations] = useState<ValidationItem[]>([]);

  useEffect(() => {
    const storedValidations = JSON.parse(
      localStorage.getItem("probe_validations") || "[]",
    );

    setValidations(storedValidations);
  }, []);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Validation Results</h1>

          <p className="text-muted-foreground">
            Sandbox execution and validation history
          </p>
        </div>

        {validations.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                No validation records found.
              </p>
            </CardContent>
          </Card>
        ) : (
          validations.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{item.language.toUpperCase()}</span>

                  <span
                    className={`text-sm font-medium ${
                      item.success ? "text-emerald-500" : "text-red-500"
                    }`}
                  >
                    {item.success ? "PASSED" : "FAILED"}
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground">Executed At</p>

                  <p>{item.createdAt}</p>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">
                    Execution Output
                  </p>

                  <pre className="max-h-64 overflow-auto rounded-md bg-black p-4 text-xs text-emerald-400">
                    {item.output || "No output available"}
                  </pre>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </DashboardShell>
  );
}

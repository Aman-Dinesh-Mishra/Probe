"use client";

import { useEffect, useState } from "react";

import DashboardShell from "@/components/dashboard/DashboardShell";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface HistoryItem {
  id: number;
  language: string;
  code: string;
  errorLog: string;
  createdAt: string;
}

export default function HistoryPage() {
  const [history, setHistory] = useState<HistoryItem[]>([]);

  useEffect(() => {
    const storedHistory = JSON.parse(
      localStorage.getItem("probe_history") || "[]",
    );

    setHistory(storedHistory);
  }, []);

  return (
    <DashboardShell>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Debug History</h1>
          <p className="text-muted-foreground">Previous debugging sessions</p>
        </div>

        {history.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <p className="text-muted-foreground">
                No debugging history found.
              </p>
            </CardContent>
          </Card>
        ) : (
          history.map((item) => (
            <Card key={item.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{item.language.toUpperCase()}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {item.createdAt}
                  </span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">
                    Error Log
                  </p>

                  <div className="rounded-md border bg-muted p-3 text-sm">
                    {item.errorLog || "No error log provided"}
                  </div>
                </div>

                <div>
                  <p className="mb-2 text-sm font-medium text-muted-foreground">
                    Code Snapshot
                  </p>

                  <pre className="max-h-64 overflow-auto rounded-md bg-black p-4 text-xs text-emerald-400">
                    {item.code}
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

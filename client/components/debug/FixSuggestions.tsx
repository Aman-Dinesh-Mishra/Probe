"use client";

import { useState } from "react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { Copy, Check } from "lucide-react";

interface FixResult {
  fixedCode: string;
  explanation: string;
  changedLines: number[];
  confidence: number;
}

interface FixSuggestionsProps {
  fix: FixResult | undefined;
  language: string;
}

export default function FixSuggestions({ fix, language }: FixSuggestionsProps) {
  const hasFix = Boolean(fix);
  const [copied, setCopied] = useState(false);

  const copyCode = async () => {
    if (!fix?.fixedCode) return;

    await navigator.clipboard.writeText(fix.fixedCode);

    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 2000);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">AI Suggestions</h3>

        <Badge variant={hasFix ? "secondary" : "outline"}>
          {hasFix
            ? `Confidence: ${(fix!.confidence * 100).toFixed(0)}%`
            : "0 Fixes"}
        </Badge>
      </div>

      {fix ? (
        <div className="space-y-4">
          <div className="rounded-lg border p-4 transition-colors hover:bg-muted/40 space-y-3">
            <div className="flex items-center gap-2">
              <Badge
                variant="outline"
                className="border-emerald-500/30 bg-emerald-500/5 text-emerald-400"
              >
                Automated Patch Strategy
              </Badge>

              {fix.changedLines.length > 0 && (
                <span className="text-xs text-muted-foreground">
                  Altered {fix.changedLines.length} lines
                </span>
              )}
            </div>

            <p className="text-sm leading-relaxed text-muted-foreground">
              {fix.explanation}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Refactored Source Layout ({language})
              </p>

              <Button size="sm" variant="outline" onClick={copyCode}>
                {copied ? (
                  <>
                    <Check className="mr-2 h-4 w-4" />
                    Copied
                  </>
                ) : (
                  <>
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Code
                  </>
                )}
              </Button>
            </div>

            <div className="max-h-[400px] overflow-auto rounded-lg border bg-zinc-950 p-4">
              <pre className="font-mono text-xs text-emerald-300 whitespace-pre">
                {fix.fixedCode}
              </pre>
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-lg border p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Analyze your code to generate AI-powered patch solutions.
          </p>
        </div>
      )}
    </div>
  );
}

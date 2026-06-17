import { Badge } from "@/components/ui/badge";

interface DebugResult {
  rootCause: string;
  errorType: string;
  severity: "low" | "medium" | "high" | "critical";
  affectedLines: number[];
  explanation: string;
  suggestedApproach: string;
}

interface ErrorPanelProps {
  error: DebugResult | undefined;
}

export default function ErrorPanel({ error }: ErrorPanelProps) {
  const hasError = Boolean(error);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Error Analysis</h3>
        <Badge variant={hasError ? "destructive" : "secondary"}>
          {hasError ? `${error?.severity.toUpperCase()} ISSUE` : "No Issues"}
        </Badge>
      </div>

      <div className="rounded-lg border p-4">
        {error ? (
          <div className="space-y-4">
            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Error Classification</p>
              <p className="text-sm font-medium text-white">{error.errorType}</p>
            </div>

            <div className="space-y-1.5">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Detected Core Anomaly</p>
              <div className="rounded-md border border-destructive/20 bg-destructive/5 p-3">
                <p className="font-mono text-xs leading-relaxed text-rose-300 whitespace-pre-wrap">{error.rootCause}</p>
              </div>
            </div>

            {error.affectedLines.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Target Lines</p>
                <div className="flex gap-1.5 flex-wrap">
                  {error.affectedLines.map((line) => (
                    <Badge key={line} variant="outline" className="font-mono text-xs">
                      Ln {line}
                    </Badge>
                  ))}
                </div>
              </div>
            )}

            <div className="space-y-1">
              <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Deep Diagnostic Breakdown</p>
              <p className="text-sm text-muted-foreground leading-relaxed">{error.explanation}</p>
            </div>
          </div>
        ) : (
          <div className="py-8 text-center">
            <p className="text-sm text-muted-foreground">
              Run analysis to inspect your workspace code for compilation issues.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
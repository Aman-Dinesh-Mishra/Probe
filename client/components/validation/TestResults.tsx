import { Badge } from "@/components/ui/badge";

interface FailureDetail {
  name: string;
  message: string;
}

interface ValidationResult {
  passed: boolean;
  totalTests: number;
  passed_count: number;
  failed_count: number;
  failures: FailureDetail[];
}

interface TestResultsProps {
  result: ValidationResult | null;
}

export default function TestResults({ result }: TestResultsProps) {
  if (!result) {
    return (
      <div className="py-8 text-center rounded-lg border">
        <p className="text-sm text-muted-foreground">
          Awaiting sandbox compilation and execution verification.
        </p>
      </div>
    );
  }

  const { passed, totalTests, passed_count, failed_count, failures } = result;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Validation Results</h3>

        <Badge variant={passed ? "default" : "destructive"}>
          {passed ? "Passed" : "Failed"}
        </Badge>
      </div>

      <div
        className={`
          rounded-lg
          border
          p-5
          transition-all
          ${
            passed
              ? "border-green-500/20 bg-green-500/5"
              : "border-destructive/20 bg-destructive/5"
          }
        `}
      >
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div
              className={`
                h-3
                w-3
                rounded-full
                ${passed ? "bg-green-500" : "bg-destructive"}
              `}
            />

            <span className="font-medium">
              {passed ? "Validation Successful" : "Validation Failed"}
            </span>
          </div>

          <p className="text-sm text-muted-foreground">
            {passed
              ? "The suggested fixes appear valid. Your code passed the validation checks."
              : "The code still contains issues. Review the analysis and suggested fixes before validating again."}
          </p>
        </div>
      </div>

      {/* Sandbox Stream Metrics Dashboard */}
      <div className="grid grid-cols-3 gap-2 text-center text-xs font-mono bg-zinc-950/20 p-3 rounded-lg border">
        <div>
          <div className="text-muted-foreground mb-0.5">Total Runs</div>
          <div className="text-sm font-bold">{totalTests}</div>
        </div>
        <div>
          <div className="text-green-500 mb-0.5">Passed</div>
          <div className="text-sm font-bold text-green-400">{passed_count}</div>
        </div>
        <div>
          <div className="text-destructive mb-0.5">Failed</div>
          <div className="text-sm font-bold text-destructive">
            {failed_count}
          </div>
        </div>
      </div>

      {/* Conditional Output Dump for Stack/Compiler Exceptions */}
      {failures.length > 0 && (
        <div className="space-y-1.5">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Compiler & Runtime Console Output
          </p>
          <div className="bg-zinc-950/60 border border-destructive/20 rounded-md p-3 font-mono text-xs text-rose-300 overflow-y-auto max-h-40 whitespace-pre-wrap leading-relaxed">
            {failures.map((fail, index) => (
              <div key={index}>
                <span className="font-bold text-rose-400">[{fail.name}]:</span>{" "}
                {fail.message}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Card Summary Block */}
      <div className="rounded-lg border p-4">
        <h4 className="mb-3 text-sm font-medium">Summary</h4>

        <div className="space-y-2 text-sm">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Analysis Status</span>

            <span>Completed</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Validation</span>

            <span>{passed ? "Passed" : "Failed"}</span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Confidence</span>

            <span>{passed ? "High" : "Needs Review"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

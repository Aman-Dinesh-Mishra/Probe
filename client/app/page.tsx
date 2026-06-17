import Link from "next/link";
import { Bug, ShieldCheck, Code2 } from "lucide-react";

export default function Landing() {
  const steps = [
    {
      step: "01",
      title: "Paste Your Code",
      description:
        "Upload snippets, files, or entire projects that need debugging.",
    },
    {
      step: "02",
      title: "AI Analysis",
      description:
        "Probe Engine examines your code for syntax, runtime, and logical issues.",
    },
    {
      step: "03",
      title: "Generate Fixes",
      description:
        "Receive optimized fixes with clear explanations and suggestions.",
    },
    {
      step: "04",
      title: "Validate Solution",
      description:
        "Run validations and verify fixes safely in a sandbox environment.",
    },
  ];

  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto flex min-h-screen max-w-7xl flex-col px-6">
        <div className="flex-1">
          <section className="flex min-h-[80vh] flex-col items-center justify-center text-center">
            <div className="mb-6 flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
              AI Powered Debugging Platform
            </div>

            <h1 className="max-w-5xl text-5xl font-bold tracking-tight md:text-7xl">
              Probe Engine
            </h1>

            <p className="mt-6 max-w-3xl text-lg text-muted-foreground md:text-xl">
              Debug, analyze, validate and improve software using AI-powered
              workflows built for modern developers.
            </p>

            <div className="mt-10 flex flex-col gap-4 sm:flex-row">
              <Link
                href="/auth/login"
                className="rounded-xl bg-primary px-8 py-3 text-primary-foreground transition hover:opacity-90"
              >
                Get Started
              </Link>

              <Link
                href="/auth/register"
                className="rounded-xl border px-8 py-3 transition hover:bg-muted"
              >
                Create Account
              </Link>
            </div>
          </section>

          <section className="pb-20">
            <div className="grid gap-6 md:grid-cols-3">
              <div className="rounded-2xl border bg-card p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <Bug className="mb-4" size={28} />

                <h3 className="mb-2 text-lg font-semibold">
                  Intelligent Debugging
                </h3>

                <p className="text-sm text-muted-foreground">
                  AI identifies syntax, runtime and logical errors instantly
                  with actionable insights.
                </p>
              </div>

              <div className="rounded-2xl border bg-card p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <ShieldCheck className="mb-4" size={28} />

                <h3 className="mb-2 text-lg font-semibold">
                  Secure Validation
                </h3>

                <p className="text-sm text-muted-foreground">
                  Verify fixes safely inside isolated sandbox environments
                  before deployment.
                </p>
              </div>

              <div className="rounded-2xl border bg-card p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                <Code2 className="mb-4" size={28} />

                <h3 className="mb-2 text-lg font-semibold">
                  Multi-Language Support
                </h3>

                <p className="text-sm text-muted-foreground">
                  Supports JavaScript, TypeScript, Python, Java, C, C++ and
                  more.
                </p>
              </div>
            </div>

            <div className="mt-32">
              <div className="mb-12 text-center">
                <h2 className="text-4xl font-bold">How It Works</h2>

                <p className="mt-3 text-muted-foreground">
                  A simple workflow from code submission to verified solutions.
                </p>
              </div>

              <div className="grid gap-6 lg:grid-cols-4">
                {steps.map((item, index) => (
                  <div key={item.step} className="relative">
                    <div className="h-full rounded-2xl border bg-card p-6 text-left transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
                      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-lg font-bold text-primary">
                        {item.step}
                      </div>

                      <h3 className="mb-3 text-lg font-semibold">
                        {item.title}
                      </h3>

                      <p className="text-sm leading-6 text-muted-foreground">
                        {item.description}
                      </p>
                    </div>

                    {index < steps.length - 1 && (
                      <div className="absolute -right-4 top-1/2 hidden -translate-y-1/2 lg:block"></div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        </div>

        <footer className="border-t py-6 text-center text-sm text-muted-foreground">
          © 2026 Probe Engine
        </footer>
      </div>
    </main>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";

export default function Login() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleLogin() {
    if (!email || !password) return;

    localStorage.setItem("probe_token", "authenticated");

    router.push("/workspace");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gradient-to-b from-background via-background to-muted/20 px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
            Welcome Back
          </div>

          <h1 className="text-4xl font-bold tracking-tight">Login to Probe</h1>

          <p className="mt-3 text-muted-foreground">
            Continue debugging smarter with AI-powered workflows.
          </p>
        </div>

        <div className="rounded-3xl border bg-card/60 p-8 shadow-xl backdrop-blur">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Email Address
              </label>

              <input
                type="email"
                placeholder="you@example.com"
                className="w-full rounded-xl border bg-background px-4 py-3 outline-none transition focus:ring-2 focus:ring-primary/20"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Password</label>

              <input
                type="password"
                placeholder="••••••••"
                className="w-full rounded-xl border bg-background px-4 py-3 outline-none transition focus:ring-2 focus:ring-primary/20"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <button
              onClick={handleLogin}
              className="w-full rounded-xl bg-primary py-3 font-medium text-primary-foreground transition hover:opacity-90"
            >
              Sign In
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Don't have an account?{" "}
              <Link
                href="/auth/register"
                className="font-medium text-primary hover:underline"
              >
                Create Account
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

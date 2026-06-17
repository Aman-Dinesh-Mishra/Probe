"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function Register() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function handleRegister() {
    if (!name || !email || !password) return;

    router.push("/auth/login");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-background px-6">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm">
            Join Probe Engine
          </div>

          <h1 className="text-4xl font-bold tracking-tight">Create Account</h1>

          <p className="mt-3 text-muted-foreground">
            Start debugging and validating code with AI assistance.
          </p>
        </div>

        <div className="rounded-3xl border bg-card p-8 shadow-lg">
          <div className="space-y-5">
            <div>
              <label className="mb-2 block text-sm font-medium">
                Full Name
              </label>

              <input
                type="text"
                placeholder="John Doe"
                className="w-full rounded-xl border bg-background px-4 py-3 outline-none transition focus:ring-2 focus:ring-primary/20"
                value={name}
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium">Email</label>

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
              onClick={handleRegister}
              className="w-full rounded-xl bg-primary py-3 font-medium text-primary-foreground transition hover:opacity-90"
            >
              Create Account
            </button>

            <p className="text-center text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link
                href="/auth/login"
                className="font-medium text-primary hover:underline"
              >
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}

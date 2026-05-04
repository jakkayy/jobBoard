"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

import { AuthCard } from "@/components/auth/auth-card";
import { loginUser, registerUser } from "@/lib/auth-api";
import { storeToken } from "@/lib/auth-token";
import type { UserRole } from "@/types/auth";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<UserRole>("candidate");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (!email || !password) {
      setError("Email and password are required.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }

    setIsSubmitting(true);
    try {
      await registerUser({ email, password, role });
      const token = await loginUser({ email, password });
      storeToken(token.access_token);
      router.push("/");
    } catch {
      setError("Could not create account. Please check your details and try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthCard title="Create your account" description="Join as a candidate or employer to get started.">
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-3 rounded-2xl bg-slate-100 p-1">
          {(["candidate", "employer"] as const).map((option) => (
            <button
              key={option}
              type="button"
              onClick={() => setRole(option)}
              className={`rounded-xl px-4 py-3 text-sm font-semibold transition ${
                role === option ? "bg-white text-blue-600 shadow-sm" : "text-slate-600 hover:text-slate-950"
              }`}
            >
              {option === "candidate" ? "Candidate" : "Employer"}
            </button>
          ))}
        </div>

        <div className="space-y-2">
          <label htmlFor="email" className="text-sm font-semibold text-slate-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="you@example.com"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="password" className="text-sm font-semibold text-slate-700">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-2xl border border-slate-300 px-4 py-3 outline-none transition focus:border-blue-500 focus:ring-4 focus:ring-blue-100"
            placeholder="At least 8 characters"
          />
        </div>

        {error ? <p className="rounded-2xl bg-red-50 px-4 py-3 text-sm font-medium text-red-700">{error}</p> : null}

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-400"
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </button>

        <p className="text-center text-sm text-slate-600">
          Already have an account? <a href="/login" className="font-semibold text-blue-600">Sign in</a>
        </p>
      </form>
    </AuthCard>
  );
}

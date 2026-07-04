"use client";

import { useState, type FormEvent } from "react";
import { useSearchParams } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const returnTo = searchParams.get("returnTo") || "/app";

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, returnTo }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to send magic link");
      }

      setSubmitted(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-bg px-4">
        <div className="w-full max-w-md">
          <div className="bg-surface rounded-lg border border-border p-8 text-center">
            <h1 className="text-2xl font-bold text-text mb-4">Check your email</h1>
            <p className="text-text-secondary mb-4">
              We&apos;ve sent a magic link to <span className="font-semibold">{email}</span>
            </p>
            <p className="text-sm text-text-secondary">
              Click the link in the email to sign in. The link expires in 24 hours.
            </p>
            <div className="mt-8 pt-8 border-t border-border">
              <button
                onClick={() => {
                  setSubmitted(false);
                  setEmail("");
                }}
                className="text-sm text-accent hover:underline"
              >
                Try another email
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md">
        <div className="bg-surface rounded-lg border border-border p-8">
          <h1 className="text-3xl font-bold text-text mb-2">Sign in</h1>
          <p className="text-text-secondary mb-8">
            We&apos;ll send you a magic link to sign in securely.
          </p>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text mb-2">
                Email address
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="w-full px-4 py-2 border border-border rounded-lg bg-bg text-text placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading || !email}
              className="w-full px-4 py-2 bg-accent text-bg font-medium rounded-lg hover:bg-accent-dark disabled:opacity-50 disabled:cursor-not-allowed transition"
            >
              {loading ? "Sending..." : "Send magic link"}
            </button>
          </form>

          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-sm text-text-secondary">
              New to Maxx?{" "}
              <a href="/pricing" className="text-accent hover:underline">
                Learn more
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

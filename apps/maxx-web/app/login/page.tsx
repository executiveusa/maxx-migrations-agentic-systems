"use client";

import { useState, type FormEvent } from "react";
import { createClient } from "@/lib/supabase/client";
import Link from "next/link";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSignIn = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        setMessage({ type: "error", text: error.message });
      } else {
        setMessage({
          type: "success",
          text: "Check your email for a magic link to log in.",
        });
        setEmail("");
      }
    } catch (error) {
      setMessage({
        type: "error",
        text: error instanceof Error ? error.message : "An error occurred",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-bg px-4">
      <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8">
        <div className="mb-8 text-center">
          <h1 className="font-display text-2xl font-semibold">Maxx Migrations</h1>
          <p className="mt-2 text-sm text-muted">Sign in to your workspace</p>
        </div>

        <form onSubmit={handleSignIn} className="space-y-4">
          <div>
            <label className="block text-sm font-medium">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@organization.org"
              required
              className="form-input mt-1"
              disabled={loading}
            />
          </div>

          {message && (
            <div
              className={`rounded-md p-3 text-sm ${
                message.type === "success"
                  ? "border border-green-500/30 bg-green-500/10 text-green-300"
                  : "border border-red-500/30 bg-red-500/10 text-red-300"
              }`}
            >
              {message.text}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-accent px-4 py-2 font-medium text-bg transition-opacity hover:bg-accent/90 disabled:opacity-50"
          >
            {loading ? "Sending magic link..." : "Send Magic Link"}
          </button>
        </form>

        <div className="mt-6 border-t border-border pt-6 text-center text-sm">
          <p className="text-muted">
            In demo mode? <Link href="/app" className="text-accent hover:underline">
              View demo app
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

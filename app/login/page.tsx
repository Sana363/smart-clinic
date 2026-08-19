"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const supabase = createClient();

    // Login
    const { data: authData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (loginError) {
      setMessage(loginError.message);
      setLoading(false);
      return;
    }

    // Get logged-in user's ID
    const userId = authData.user?.id;

    if (!userId) {
      setMessage("Could not find user.");
      setLoading(false);
      return;
    }

    // Get user's role from profiles table
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role")
      .eq("id", userId)
      .single();

    if (profileError) {
      setMessage("Could not load user profile.");
      console.error(profileError);
      setLoading(false);
      return;
    }

    setMessage("Login successful!");

    // Send user to correct dashboard
    if (profile.role === "doctor") {
      router.push("/doctor");
    } else {
      router.push("/patient");
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-lg">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-blue-600">
            SmartClinic
          </h1>

          <p className="mt-2 text-slate-500">
            Sign in to your account
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="w-full rounded-lg border px-4 py-3 outline-none focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-3 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-slate-600">
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-slate-600">
          Don't have an account?{" "}
          <a
            href="/signup"
            className="font-semibold text-blue-600"
          >
            Sign up
          </a>
        </p>
      </div>
    </main>
  );
}
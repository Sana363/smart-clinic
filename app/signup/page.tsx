"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setMessage("");

    const supabase = createClient();

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) {
      setMessage(error.message);
      setLoading(false);
      return;
    }

    if (data.user) {
      const { error: profileError } = await supabase
        .from("profiles")
        .insert({
          id: data.user.id,
          email: email,
          full_name: fullName,
          role: "patient",
        });

      if (profileError) {
        setMessage(profileError.message);
        setLoading(false);
        return;
      }
    }

    setMessage(
      "Signup successful! Your account has been created as a Patient. Please check your email if confirmation is required."
    );

    setEmail("");
    setPassword("");
    setFullName("");
    setLoading(false);
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100 px-6">
      <div className="w-full max-w-md rounded-xl bg-white p-8 shadow-md">

        <h1 className="mb-6 text-center text-3xl font-bold text-blue-600">
          Create Account
        </h1>

        <form onSubmit={handleSignup} className="space-y-4">

          <div>
            <label className="mb-1 block font-medium">
              Full Name
            </label>

            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder="Enter your full name"
              required
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>

          <div>
            <label className="mb-1 block font-medium">
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              minLength={6}
              required
              className="w-full rounded-lg border px-4 py-2"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-blue-600 py-2 font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Creating Account..." : "Sign Up"}
          </button>

        </form>

        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">
            {message}
          </p>
        )}

        <p className="mt-6 text-center text-sm text-gray-600">
          Already have an account?{" "}
          <a
            href="/login"
            className="font-semibold text-blue-600"
          >
            Login
          </a>
        </p>

      </div>
    </main>
  );
}
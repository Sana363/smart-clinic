"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function PatientDashboard() {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(true);

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    async function loadProfile() {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("profiles")
        .select("full_name")
        .eq("id", user.id)
        .single();

      if (error) {
        console.error(error);
        setName("Patient");
      } else {
        setName(data?.full_name || "Patient");
      }

      setLoading(false);
    }

    loadProfile();
  }, []);

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-50">
        <p>Loading dashboard...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-6">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-8 flex items-center justify-between rounded-2xl bg-white p-6 shadow">
          <div>
            <h1 className="text-3xl font-bold text-blue-600">
              SmartClinic
            </h1>

            <p className="mt-1 text-slate-500">
              Welcome, {name}
            </p>
          </div>

          <button
            onClick={logout}
            className="rounded-lg bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        {/* Dashboard */}
        <div className="grid gap-6 md:grid-cols-2">

          {/* Book Appointment */}
          <div className="rounded-2xl bg-white p-6 shadow">
            <div className="mb-4 text-4xl">📅</div>

            <h2 className="text-xl font-bold text-slate-800">
              Book Appointment
            </h2>

            <p className="mt-2 text-slate-500">
              Schedule an appointment with a doctor.
            </p>

            <button
              onClick={() => router.push("/patient/book")}
              className="mt-5 rounded-lg bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700"
            >
              Book Appointment
            </button>
          </div>

          {/* My Appointments */}
          <div className="rounded-2xl bg-white p-6 shadow">
            <div className="mb-4 text-4xl">📋</div>

            <h2 className="text-xl font-bold text-slate-800">
              My Appointments
            </h2>

            <p className="mt-2 text-slate-500">
              View your appointments and check their status.
            </p>

            <button
              onClick={() => router.push("/patient/my-appointments")}
              className="mt-5 rounded-lg bg-green-600 px-5 py-3 font-semibold text-white hover:bg-green-700"
            >
              View Appointments
            </button>
          </div>

        </div>
      </div>
    </main>
  );
}
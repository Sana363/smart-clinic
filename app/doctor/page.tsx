"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function DoctorDashboard() {
  const supabase = createClient();
  const router = useRouter();

  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function loadAppointments() {
    const { data, error } = await supabase
      .from("appointments")
      .select("*")
      .order("appointment_date", { ascending: true });

    if (error) {
      console.error("Error loading appointments:", error);
      alert("Could not load appointments: " + error.message);
      return;
    }

    setAppointments(data || []);
    setLoading(false);
  }

  useEffect(() => {
    loadAppointments();
  }, []);

  async function updateStatus(id: string, status: string) {
    const { error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id);

    if (error) {
      console.error("Update error:", error);
      alert("Could not update appointment: " + error.message);
      return;
    }

    await loadAppointments();
  }

  async function logout() {
    await supabase.auth.signOut();
    router.push("/login");
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 p-8">
        <h1 className="text-3xl font-bold text-blue-600">
          Doctor Dashboard
        </h1>

        <p className="mt-4">Loading appointments...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 p-8">
      <div className="mx-auto max-w-5xl">

        {/* TOP BAR */}
        <div className="mb-8 flex items-center justify-between rounded-2xl bg-white p-6 shadow">
          
          <div>
            <h1 className="text-3xl font-bold text-blue-600">
              Doctor Dashboard
            </h1>

            <p className="mt-2 text-slate-500">
              Manage patient appointments
            </p>
          </div>

          {/* LOGOUT */}
          <button
            onClick={logout}
            className="rounded-lg bg-red-600 px-6 py-3 font-bold text-white hover:bg-red-700"
          >
            LOGOUT
          </button>

        </div>

        {/* APPOINTMENTS */}
        {appointments.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 shadow">
            <p>No appointments found.</p>
          </div>
        ) : (
          <div className="space-y-5">
            {appointments.map((appointment) => (
              <div
                key={appointment.id}
                className="rounded-2xl bg-white p-6 shadow"
              >
                <h2 className="mb-4 text-xl font-bold text-slate-800">
                  Patient Appointment
                </h2>

                <p className="mb-2">
                  <strong>Date:</strong>{" "}
                  {appointment.appointment_date}
                </p>

                <p className="mb-2">
                  <strong>Time:</strong>{" "}
                  {appointment.appointment_time}
                </p>

                <p className="mb-2">
                  <strong>Reason:</strong>{" "}
                  {appointment.reason}
                </p>

                <p className="mb-5">
                  <strong>Status:</strong>{" "}
                  {appointment.status || "pending"}
                </p>

                <button
                  onClick={() =>
                    updateStatus(
                      appointment.id,
                      "approved"
                    )
                  }
                  className="mr-3 rounded-lg bg-green-600 px-5 py-2 font-semibold text-white hover:bg-green-700"
                >
                  Approve
                </button>

                <button
                  onClick={() =>
                    updateStatus(
                      appointment.id,
                      "rejected"
                    )
                  }
                  className="rounded-lg bg-red-600 px-5 py-2 font-semibold text-white hover:bg-red-700"
                >
                  Reject
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </main>
  );
}
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function MyAppointments() {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const router = useRouter();
  const supabase = createClient();

  useEffect(() => {
    loadAppointments();
  }, []);

  async function loadAppointments() {
    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { data, error } = await supabase
        .from("appointments")
        .select("*")
        .eq("patient_id", user.id)
        .order("appointment_date", { ascending: true });

      if (error) {
        setError(error.message);
        return;
      }

      setAppointments(data || []);
    } catch (err: any) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return <div style={{ padding: "30px" }}>Loading appointments...</div>;
  }

  return (
    <main style={{ padding: "30px", maxWidth: "900px", margin: "auto" }}>
      <h1>My Appointments</h1>

      <button
        onClick={() => router.push("/patient/dashboard")}
        style={{
          marginTop: "15px",
          marginBottom: "25px",
          padding: "10px 18px",
          cursor: "pointer",
        }}
      >
        Back to Dashboard
      </button>

      {error && (
        <p style={{ color: "red" }}>
          Error: {error}
        </p>
      )}

      {!error && appointments.length === 0 && (
        <p>No appointments yet.</p>
      )}

      {appointments.map((appointment) => (
        <div
          key={appointment.id}
          style={{
            border: "1px solid #ddd",
            borderRadius: "10px",
            padding: "20px",
            marginBottom: "15px",
          }}
        >
          <h2>Appointment</h2>

          <p>
            <strong>Date:</strong>{" "}
            {appointment.appointment_date}
          </p>

          <p>
            <strong>Time:</strong>{" "}
            {appointment.appointment_time}
          </p>

          {appointment.reason && (
            <p>
              <strong>Reason:</strong> {appointment.reason}
            </p>
          )}

          {appointment.status && (
            <p>
              <strong>Status:</strong> {appointment.status}
            </p>
          )}
        </div>
      ))}
    </main>
  );
}
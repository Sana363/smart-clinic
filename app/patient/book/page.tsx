"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function BookAppointment() {
  const router = useRouter();
  const supabase = createClient();

  const [doctorName, setDoctorName] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        router.push("/login");
        return;
      }

      const { error } = await supabase
        .from("appointments")
        .insert({
          patient_id: user.id,
          doctor_name: doctorName,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          reason: reason,
          status: "Pending",
        });

      if (error) throw error;

      setMessage("Appointment booked successfully!");

      setDoctorName("");
      setAppointmentDate("");
      setAppointmentTime("");
      setReason("");
    } catch (error: any) {
      setMessage(error.message || "Failed to book appointment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f7fb",
        padding: "40px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "0 auto",
          background: "white",
          padding: "30px",
          borderRadius: "12px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <button
          onClick={() => router.push("/patient")}
          style={{
            padding: "10px 15px",
            marginBottom: "20px",
            cursor: "pointer",
          }}
        >
          ← Dashboard
        </button>

        <h1>Book an Appointment</h1>

        <p style={{ color: "#666" }}>
          Enter your appointment details.
        </p>

        <form onSubmit={handleSubmit}>
          <label>Doctor Name</label>

          <input
            type="text"
            value={doctorName}
            onChange={(e) => setDoctorName(e.target.value)}
            placeholder="Enter doctor name"
            required
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
              marginBottom: "18px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />

          <label>Appointment Date</label>

          <input
            type="date"
            value={appointmentDate}
            onChange={(e) => setAppointmentDate(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
              marginBottom: "18px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />

          <label>Appointment Time</label>

          <input
            type="time"
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            required
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
              marginBottom: "18px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />

          <label>Reason for Visit</label>

          <textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Enter reason"
            required
            rows={4}
            style={{
              width: "100%",
              padding: "12px",
              marginTop: "6px",
              marginBottom: "20px",
              border: "1px solid #ccc",
              borderRadius: "8px",
            }}
          />

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",
              padding: "13px",
              border: "none",
              borderRadius: "8px",
              cursor: "pointer",
              fontSize: "16px",
            }}
          >
            {loading ? "Booking..." : "Book Appointment"}
          </button>
        </form>

        {message && (
          <p
            style={{
              marginTop: "20px",
              padding: "12px",
              background: "#f0f0f0",
              borderRadius: "8px",
            }}
          >
            {message}
          </p>
        )}

        <button
          onClick={() => router.push("/my-appointments")}
          style={{
            width: "100%",
            marginTop: "15px",
            padding: "12px",
            cursor: "pointer",
          }}
        >
          My Appointments
        </button>
      </div>
    </main>
  );
}
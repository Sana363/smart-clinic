"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function BookAppointment() {
  const router = useRouter();

  const [doctorName, setDoctorName] = useState("");
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!doctorName || !appointmentDate || !appointmentTime || !reason) {
      alert("Please fill in all fields.");
      return;
    }

    setLoading(true);

    try {
      const supabase = createClient();

      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("Please login first.");
        router.push("/login");
        return;
      }

      const { error } = await supabase.from("appointments").insert([
        {
          patient_id: user.id,
          doctor_name: doctorName,
          appointment_date: appointmentDate,
          appointment_time: appointmentTime,
          reason: reason,
          status: "pending",
        },
      ]);

      if (error) {
        console.error(error);
        alert("Could not book appointment: " + error.message);
        return;
      }

      alert("Appointment booked successfully!");

      setDoctorName("");
      setAppointmentDate("");
      setAppointmentTime("");
      setReason("");

      router.push("/patient");
    } catch (error) {
      console.error(error);
      alert("Something went wrong while booking the appointment.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-center mb-6">
            Book Appointment
          </h1>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block font-medium mb-2">
                Doctor Name
              </label>

              <input
                type="text"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                placeholder="Enter doctor name"
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Appointment Date
              </label>

              <input
                type="date"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Appointment Time
              </label>

              <input
                type="time"
                value={appointmentTime}
                onChange={(e) => setAppointmentTime(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block font-medium mb-2">
                Reason
              </label>

              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for appointment"
                rows={4}
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? "Booking..." : "Book Appointment"}
              </button>

              <button
                type="button"
                onClick={() => router.push("/patient")}
                className="flex-1 bg-gray-500 text-white py-2 rounded-lg hover:bg-gray-600"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
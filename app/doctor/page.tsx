"use client";

import { useEffect, useState } from "react";
import { createClient } from "@/lib/supabase";
import { useRouter } from "next/navigation";

export default function DoctorDashboard() {
  const router = useRouter();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAppointments = async () => {
      try {
        const supabase = createClient();

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
          .order("appointment_date", { ascending: true });

        if (error) {
          console.error(error);
          return;
        }

        setAppointments(data || []);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };

    loadAppointments();
  }, [router]);

  const updateStatus = async (
    id: string,
    status: "approved" | "rejected"
  ) => {
    const supabase = createClient();

    const { error } = await supabase
      .from("appointments")
      .update({ status })
      .eq("id", id);

    if (error) {
      alert(error.message);
      return;
    }

    setAppointments((current) =>
      current.map((appointment) =>
        appointment.id === id ? { ...appointment, status } : appointment
      )
    );
  };

  const logout = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push("/login");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        Loading...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Doctor Dashboard</h1>

          <button
            onClick={logout}
            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">
            Patient Appointments
          </h2>

          {appointments.length === 0 ? (
            <p className="text-gray-600">No appointments found.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="border-b">
                    <th className="text-left p-3">Doctor</th>
                    <th className="text-left p-3">Date</th>
                    <th className="text-left p-3">Time</th>
                    <th className="text-left p-3">Reason</th>
                    <th className="text-left p-3">Status</th>
                    <th className="text-left p-3">Action</th>
                  </tr>
                </thead>

                <tbody>
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="border-b">
                      <td className="p-3">
                        {appointment.doctor_name}
                      </td>

                      <td className="p-3">
                        {appointment.appointment_date}
                      </td>

                      <td className="p-3">
                        {appointment.appointment_time}
                      </td>

                      <td className="p-3">
                        {appointment.reason}
                      </td>

                      <td className="p-3 capitalize">
                        {appointment.status}
                      </td>

                      <td className="p-3">
                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              updateStatus(appointment.id, "approved")
                            }
                            className="bg-green-500 text-white px-3 py-1 rounded"
                          >
                            Approve
                          </button>

                          <button
                            onClick={() =>
                              updateStatus(appointment.id, "rejected")
                            }
                            className="bg-red-500 text-white px-3 py-1 rounded"
                          >
                            Reject
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
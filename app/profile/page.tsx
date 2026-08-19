"use client";

import { useRouter } from "next/navigation";

export default function Profile() {
  const router = useRouter();

  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "#f5f7fb",
      }}
    >
      <div
        style={{
          maxWidth: "600px",
          margin: "auto",
          background: "white",
          padding: "30px",
          borderRadius: "12px",
        }}
      >
        <h1>My Profile</h1>

        <p>Patient Profile</p>

        <button
          onClick={() => router.push("/patient")}
          style={{
            padding: "12px 20px",
            marginTop: "20px",
            cursor: "pointer",
          }}
        >
          ← Back to Dashboard
        </button>
      </div>
    </main>
  );
}
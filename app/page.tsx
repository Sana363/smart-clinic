export default function Home() {
  return (
    <main className="min-h-screen bg-slate-50">
      {/* Navigation */}
      <nav className="flex items-center justify-between border-b bg-white px-8 py-5">
        <div className="text-2xl font-bold text-blue-600">
          SmartClinic
        </div>

        <div className="flex gap-4">
          <a
            href="/login"
            className="rounded-lg border border-blue-600 px-5 py-2 text-blue-600 hover:bg-blue-50"
          >
            Login
          </a>

          <a
            href="/signup"
            className="rounded-lg bg-blue-600 px-5 py-2 text-white hover:bg-blue-700"
          >
            Get Started
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section className="mx-auto flex max-w-6xl flex-col items-center px-6 py-24 text-center">
        <div className="mb-6 rounded-full bg-blue-100 px-4 py-2 text-sm font-medium text-blue-700">
          Smart Healthcare Management
        </div>

        <h1 className="max-w-4xl text-5xl font-bold tracking-tight text-slate-900">
          Healthcare made
          <span className="text-blue-600"> simple and smart.</span>
        </h1>

        <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600">
          SmartClinic connects patients and doctors in one
          easy-to-use healthcare management system.
        </p>

        <div className="mt-10 flex gap-4">
          <a
            href="/signup"
            className="rounded-lg bg-blue-600 px-7 py-3 font-semibold text-white hover:bg-blue-700"
          >
            Get Started
          </a>

          <a
            href="#features"
            className="rounded-lg border border-slate-300 bg-white px-7 py-3 font-semibold text-slate-700 hover:bg-slate-50"
          >
            Explore Features
          </a>
        </div>
      </section>

      {/* Features */}
      <section
        id="features"
        className="mx-auto max-w-6xl px-6 pb-24"
      >
        <h2 className="mb-10 text-center text-3xl font-bold text-slate-900">
          Everything your clinic needs
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Doctor */}
          <div className="rounded-xl bg-white p-7 shadow-sm">
            <div className="mb-4 text-3xl">👨‍⚕️</div>

            <h3 className="text-xl font-bold">
              For Doctors
            </h3>

            <p className="mt-3 text-slate-600">
              Manage appointments and approve or reject
              patient appointment requests.
            </p>
          </div>

          {/* Patient */}
          <div className="rounded-xl bg-white p-7 shadow-sm">
            <div className="mb-4 text-3xl">🧑‍🤝‍🧑</div>

            <h3 className="text-xl font-bold">
              For Patients
            </h3>

            <p className="mt-3 text-slate-600">
              Book appointments, view appointments, and
              check their approval status.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-white py-6 text-center text-sm text-slate-500">
        © 2026 SmartClinic. Smart Healthcare Management System.
      </footer>
    </main>
  );
}
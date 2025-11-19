import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabaseServer";

export default async function LandingPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/dashboard");

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 via-white to-purple-50">
      {/* Navbar */}
      <header className="fixed w-full z-50 bg-white/70 backdrop-blur-md shadow-md py-4">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-indigo-700">Quizzy</h1>
          <nav className="space-x-6">
            <a
              href="/signup"
              className="text-indigo-600 font-medium hover:underline"
            >
              Sign Up
            </a>
            <a
              href="/login"
              className="text-indigo-600 font-medium hover:underline"
            >
              Login
            </a>
          </nav>
        </div>
      </header>

      {/* Hero */}
      <section className="pt-32 pb-24 text-center px-6">
        <h1 className="text-5xl sm:text-6xl font-extrabold text-indigo-800 mb-6 animate-fadeIn">
          Create & Share Quizzes <br /> Get Real-Time Insights
        </h1>
        <p className="text-gray-700 text-lg sm:text-xl mb-8 animate-fadeIn delay-200">
          Build custom quizzes for teams, education, or personal projects. Track responses instantly and make data-driven decisions.
        </p>
        <div className="flex justify-center gap-4 flex-wrap animate-fadeIn delay-400">
          <a
            href="/signup"
            className="rounded-2xl bg-indigo-600 text-white px-6 py-3 font-semibold shadow-lg hover:bg-indigo-700 transition"
          >
            Get Started
          </a>
          <a
            href="#features"
            className="rounded-2xl border border-indigo-600 text-indigo-600 px-6 py-3 font-semibold hover:bg-indigo-50 transition"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-6 lg:px-8 py-24 space-y-16">
        <h2 className="text-3xl font-bold text-center text-indigo-700 animate-fadeIn">
          Why Choose Quizzy?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {[
            {
              icon: "📝",
              title: "Easy Quiz Builder",
              desc: "Intuitive drag-and-drop builder to create quizzes in minutes.",
            },
            {
              icon: "📊",
              title: "Insights & Analytics",
              desc: "Visualize responses and get actionable insights instantly.",
            },
            {
              icon: "🚀",
              title: "Share Anywhere",
              desc: "Share quizzes via link or embed on your website easily.",
            },
          ].map((f, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl shadow-xl p-8 text-center hover:scale-105 transform transition duration-300"
            >
              <div className="text-indigo-600 text-5xl mb-4">{f.icon}</div>
              <h3 className="font-semibold text-2xl mb-2">{f.title}</h3>
              <p className="text-gray-600">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Testimonials */}
      <section className="bg-purple-50 py-24 px-6">
        <h2 className="text-3xl font-bold text-center text-indigo-700 mb-16 animate-fadeIn">
          What Users Say
        </h2>
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            {
              quote: "Quizzy helped our team create engaging quizzes effortlessly!",
              name: "Alice T.",
            },
            {
              quote: "The analytics feature is super insightful and saves us time.",
              name: "Mark P.",
            },
            {
              quote: "Sharing quizzes is a breeze. Highly recommend!",
              name: "Sophia L.",
            },
          ].map((t, i) => (
            <div
              key={i}
              className="bg-white rounded-3xl shadow-lg p-8 text-center hover:shadow-2xl transition duration-300"
            >
              <p className="text-gray-700 mb-4">“{t.quote}”</p>
              <span className="font-semibold text-indigo-700">— {t.name}</span>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 py-24 text-center text-white">
        <h2 className="text-4xl sm:text-5xl font-bold mb-6 animate-fadeIn">
          Ready to Start Creating?
        </h2>
        <p className="mb-8 text-lg sm:text-xl animate-fadeIn delay-200">
          Join hundreds of creators using Quizzy to make engaging quizzes.
        </p>
        <a
          href="/signup"
          className="rounded-2xl bg-white text-indigo-700 px-8 py-4 font-semibold shadow-lg hover:bg-gray-100 transition animate-fadeIn delay-400"
        >
          Sign Up Now
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-50 py-8 text-center text-gray-600">
        &copy; {new Date().getFullYear()} Quizzy. All rights reserved.
      </footer>
    </div>
  );
}

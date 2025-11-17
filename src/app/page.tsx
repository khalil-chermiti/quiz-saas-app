import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabaseServer";

export default async function LandingPage() {
  const supabase = await createClient();

  // Get the current session
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    // If logged in, redirect to dashboard
    redirect("/dashboard");
  }
  return (
    <div className="min-h-screen bg-linear-to-r from-indigo-50 to-purple-100">
      {/* Top Header */}
      <header className="bg-white shadow-md py-4">
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

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 lg:px-8 flex flex-col items-center gap-6 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-bold text-indigo-700 animate-fadeIn">
          Create Engaging Quizzes <br /> and Gain Insights
        </h1>
        <p className="text-gray-700 text-lg sm:text-xl animate-fadeIn delay-200">
          Build custom quizzes for your company or personal projects, share them
          easily, and get actionable insights from responses.
        </p>
        <div className="flex justify-center gap-4 animate-fadeIn delay-400">
          <a
            href="/signup"
            className="rounded-xl bg-indigo-600 text-white px-6 py-3 font-medium shadow-lg hover:bg-indigo-700 transition"
          >
            Get Started
          </a>
          <a
            href="#features"
            className="rounded-xl border border-indigo-600 text-indigo-600 px-6 py-3 font-medium hover:bg-indigo-50 transition"
          >
            Learn More
          </a>
        </div>
      </section>

      {/* Features Section */}
      <section
        id="features"
        className="max-w-7xl mx-auto px-6 lg:px-8 py-24 space-y-16"
      >
        <h2 className="text-3xl font-bold text-center text-indigo-700 animate-fadeIn">
          Why Choose Our Platform?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:scale-105 transform transition">
            <div className="mb-4 text-indigo-600 text-4xl">📝</div>
            <h3 className="font-semibold text-xl mb-2">Easy Quiz Builder</h3>
            <p className="text-gray-600">
              Create quizzes in minutes with our intuitive drag-and-drop
              builder.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:scale-105 transform transition">
            <div className="mb-4 text-indigo-600 text-4xl">📊</div>
            <h3 className="font-semibold text-xl mb-2">Insights & Analytics</h3>
            <p className="text-gray-600">
              Visualize responses and get actionable insights for your quizzes.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow-xl p-8 text-center hover:scale-105 transform transition">
            <div className="mb-4 text-indigo-600 text-4xl">🚀</div>
            <h3 className="font-semibold text-xl mb-2">Share Anywhere</h3>
            <p className="text-gray-600">
              Share quizzes via links or embed them on your website
              effortlessly.
            </p>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-linear-to-r from-indigo-600 to-purple-600 py-20 text-center text-white">
        <h2 className="text-3xl sm:text-4xl font-bold mb-4 animate-fadeIn">
          Ready to Start Creating?
        </h2>
        <p className="mb-8 text-lg sm:text-xl animate-fadeIn delay-200">
          Join hundreds of companies and individuals using our platform.
        </p>
        <a
          href="/signup"
          className="rounded-xl bg-white text-indigo-700 px-8 py-4 font-semibold shadow-lg hover:bg-gray-100 transition animate-fadeIn delay-400"
        >
          Sign Up Now
        </a>
      </section>

      {/* Footer */}
      <footer className="bg-indigo-50 py-8 text-center text-gray-600">
        &copy; {new Date().getFullYear()} QuizMaster. All rights reserved.
      </footer>
    </div>
  );
}

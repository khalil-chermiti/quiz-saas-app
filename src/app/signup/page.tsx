import { signupAction } from "@/actions/signup";

export default async function SignupPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-indigo-50 to-purple-100 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-indigo-100">
        <h1 className="text-2xl font-semibold text-indigo-700 text-center mb-6">
          Create your account
        </h1>

        {error && (
          <p className="mb-4 text-center text-sm text-red-600">{error}</p>
        )}

        <form action={signupAction} className="flex flex-col gap-5">
          <div className="flex gap-3">
            <input
              name="first_name"
              placeholder="First name"
              required
              className="flex-1 min-w-0 rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
            <input
              name="last_name"
              placeholder="Last name"
              required
              className="flex-1 min-w-0 rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>

          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="rounded-xl border p-3 focus:outline-none focus:ring-2 focus:ring-indigo-400"
          />

          <label className="flex items-center gap-3 text-sm text-gray-700">
            <input
              type="checkbox"
              name="is_enterprise"
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-400"
            />
            I am creating an enterprise account
          </label>

          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-indigo-600 py-3 text-white font-medium shadow-md hover:bg-indigo-700 transition"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Already have an account?
          <a href="/login" className="text-indigo-600 ml-1 hover:underline">
            Log in
          </a>
        </p>
      </div>
    </div>
  );
}

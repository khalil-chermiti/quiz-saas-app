import { loginAction } from "@/actions/login";

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-br from-indigo-50 to-purple-100 p-6">
      <div className="w-full max-w-md rounded-2xl bg-white p-8 shadow-xl border border-indigo-100">
        <h1 className="text-2xl font-semibold text-indigo-700 text-center mb-6">
          Log in to your account
        </h1>

        {error && (
          <p className="mb-4 text-center text-sm text-red-600">{error}</p>
        )}

        <form action={loginAction} className="flex flex-col gap-5">
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

          <button
            type="submit"
            className="mt-2 w-full rounded-xl bg-indigo-600 py-3 text-white font-medium shadow-md hover:bg-indigo-700 transition"
          >
            Log In
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-5">
          Don’t have an account?
          <a href="/signup" className="text-indigo-600 ml-1 hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}

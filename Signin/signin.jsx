import { FcGoogle } from "react-icons/fc";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-black px-4">
      <div className="w-full max-w-md bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 rounded-2xl shadow-2xl overflow-hidden text-white">

        <div className="p-8">

          {/* Logo */}
          <div className="flex justify-center mb-6">
            <div className="px-4 py-2 bg-zinc-950 rounded-md text-sm font-semibold tracking-wide">
              NextStep.ai
            </div>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-semibold text-center">
            Sign in to NextStep.ai
          </h2>
          <p className="text-center text-zinc-400 text-sm mt-2 mb-6">
            Welcome back! Please sign in to continue
          </p>

          {/* Google Button */}
          <div className="relative">
            <button className="w-full flex items-center justify-center gap-3 bg-zinc-800 hover:bg-zinc-700 transition rounded-lg py-3 border border-zinc-700">
              <FcGoogle size={20} />
              <span className="text-sm font-medium">
                Continue with Google
              </span>
            </button>

            <span className="absolute -right-2 -top-2 text-xs bg-zinc-700 px-3 py-1 rounded-full border border-zinc-600">
              Last used
            </span>
          </div>

          {/* Divider */}
          <div className="flex items-center my-6">
            <div className="flex-1 h-px bg-zinc-700" />
            <span className="px-3 text-zinc-400 text-sm">or</span>
            <div className="flex-1 h-px bg-zinc-700" />
          </div>

          {/* Email / Username */}
          <div className="mb-6">
            <label className="text-sm text-zinc-300">
              Email address or username
            </label>
            <input
              type="text"
              placeholder="Enter email or username"
              className="mt-1 w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Continue Button */}
          <button
            type="button"
            className="w-full bg-white text-black font-medium py-3 rounded-lg hover:bg-zinc-200 transition"
          >
            Continue
          </button>

          {/* Signup Link */}
          <p className="text-center text-zinc-400 text-sm mt-6">
            Don’t have an account?{" "}
            <span className="text-white cursor-pointer hover:underline">
              Sign up
            </span>
          </p>

        </div>

      </div>
    </div>
  );
}

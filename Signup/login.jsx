import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="min-h-screen flex items-center justify-center bg-black">
      <div className="w-full max-w-md bg-gradient-to-b from-zinc-900 via-zinc-800 to-zinc-900 rounded-2xl shadow-2xl p-8 text-white">

        {/* Logo */}
        <div className="flex justify-center mb-6">
          <div className="px-4 py-2 bg-zinc-950 rounded-md text-sm font-semibold tracking-wide">
            NextStep.ai
          </div>
        </div>

        {/* Title */}
        <h2 className="text-2xl font-semibold text-center">
          Create your account
        </h2>
        <p className="text-center text-zinc-400 text-sm mt-2 mb-6">
          Welcome! Please fill in the details to get started.
        </p>

        {/* Google Button */}
        <button className="w-full flex items-center justify-center gap-3 bg-zinc-800 hover:bg-zinc-700 transition rounded-lg py-3 border border-zinc-700">
          <FcGoogle size={20} />
          <span className="text-sm font-medium">
            Continue with Google
          </span>
        </button>

        {/* Divider */}
        <div className="flex items-center my-6">
          <div className="flex-1 h-px bg-zinc-700" />
          <span className="px-3 text-zinc-400 text-sm">or</span>
          <div className="flex-1 h-px bg-zinc-700" />
        </div>

        {/* Form */}
        <form className="space-y-4">

          {/* First & Last Name */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-zinc-300">
                First name <span className="text-zinc-500">Optional</span>
              </label>
              <input
                type="text"
                placeholder="First name"
                className="mt-1 w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <div>
              <label className="text-sm text-zinc-300">
                Last name <span className="text-zinc-500">Optional</span>
              </label>
              <input
                type="text"
                placeholder="Last name"
                className="mt-1 w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>

          {/* Username */}
          <div>
            <label className="text-sm text-zinc-300">
              Username
            </label>
            <input
              type="text"
              className="mt-1 w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Email */}
          <div>
            <label className="text-sm text-zinc-300">
              Email address
            </label>
            <input
              type="email"
              placeholder="Enter your email address"
              className="mt-1 w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          {/* Password */}
          <div>
            <label className="text-sm text-zinc-300">
              Password
            </label>
            <div className="relative mt-1">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                className="w-full bg-zinc-900 border border-zinc-700 rounded-lg px-3 py-2 text-sm pr-10 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-2.5 text-zinc-400 hover:text-white"
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {/* Continue Button */}
          <button
            type="submit"
            className="w-full bg-white text-black font-medium py-3 rounded-lg mt-4 hover:bg-zinc-200 transition"
          >
            Continue
          </button>
        </form>

        {/* Footer */}
        <p className="text-center text-zinc-400 text-sm mt-6">
          Already have an account?{" "}
          <span className="text-white cursor-pointer hover:underline">
            Sign in
          </span>
        </p>

      </div>
    </div>
  );
}

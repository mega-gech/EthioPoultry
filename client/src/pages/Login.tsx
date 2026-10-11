
import { useState } from "react";
import logoHen from '../assets/logo_hen.jpg'
import { Link } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
} from "lucide-react";

export default function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Temporary login behavior.
    // We will connect this to the backend later.
    console.log({ email, password, rememberMe });
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl md:grid md:grid-cols-2">

        {/* Left image panel */}
        <div className="relative hidden min-h-[600px] md:block">
          <img
            src={logoHen}
            alt="Hen and fresh eggs on a poultry farm"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-green-950/90 via-green-900/20 to-green-900/30" />

          <div className="absolute inset-x-0 top-8 text-center text-white">
            <h1 className="text-3xl font-bold">
              Ethio<span className="text-lime-300">Poultry</span>
            </h1>
            <p className="mt-1 text-sm">Connecting farms to markets</p>
          </div>

          <div className="absolute bottom-10 left-7 right-7 text-white">
            <h2 className="text-3xl font-bold leading-tight">
              Welcome Back to EthioPoultry
            </h2>
            <p className="mt-3 text-base text-green-50">
              Your trusted partner for poultry products and farming
              opportunities.
            </p>
          </div>
        </div>

        {/* Right login panel */}
        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-14">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Login to your account
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Welcome back! Please enter your details.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="email"
                  type="email"
                  placeholder="Enter your email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  autoComplete="email"
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-4 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-sm font-medium text-gray-700"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  autoComplete="current-password"
                  className="w-full rounded-lg border border-gray-300 py-3 pl-10 pr-12 outline-none transition focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-green-700"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember me and forgot password */}
            <div className="flex flex-wrap items-center justify-between gap-3 text-sm">
              <label className="flex cursor-pointer items-center gap-2 text-gray-600">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 accent-green-600"
                />
                Remember me
              </label>

              <Link
                to="/forgot-password"
                className="font-medium text-green-700 hover:text-green-900"
              >
                Forgot password?
              </Link>
            </div>

            {/* Login button */}
            <button
              type="submit"
              className="w-full rounded-lg bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Login
            </button>
          </form>

          {/* Alternative login options */}
          <div className="my-6 flex items-center gap-3">
            <div className="h-px flex-1 bg-gray-200" />
            <span className="text-sm text-gray-400">Or continue with</span>
            <div className="h-px flex-1 bg-gray-200" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <span className="font-bold text-base text-blue-600">G</span>
              Google
            </button>

            <button
              type="button"
              className="flex items-center justify-center gap-2 rounded-lg border border-gray-300 py-3 text-sm font-medium text-gray-700 hover:bg-gray-50"
            >
              <span className="font-bold text-base text-blue-700">f</span>
              Facebook
            </button>
          </div>

          <p className="mt-8 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-semibold text-green-700 hover:text-green-900"
            >
              Sign up
            </Link>
          </p>

          <p className="mt-5 text-center text-xs text-gray-400">
            By continuing, you agree to our Terms of Service and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}
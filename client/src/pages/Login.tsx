
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Eye,
  EyeOff,
  Mail,
  LockKeyhole,
  ArrowRight,
  ShieldCheck,
} from "lucide-react";

import logoHen from "../assets/logo_hen.jpg";

export default function Login() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async(e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!email.trim() || !password) {
      setError("Please enter your email address and password.");
      return;
    }

    console.log("Email being sent:", JSON.stringify(email.trim()));
    console.log("Password length:", password.length);

    try
    {
     const response = await fetch(
    "http://localhost:5000/api/auth/login",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.trim(),
        password: password,
      }),
    }
  );

  const data = await response.json();

  console.log("Login status:", response.status);
  console.log("Login response:", data);

  if (!response.ok) {
    setError(data.message || "Login failed.");
    return;
  }

  setMessage("Login successful!");
  localStorage.setItem("token", data.token);
  localStorage.setItem("user", JSON.stringify(data.user));

 setMessage("Login successful!");
 
if (data.user.role === "seller") {
  navigate("/seller/dashboard");
} else if (data.user.role === "buyer") {
  navigate("/buyer/dashboard");
} else {
  navigate("/");
}

 } catch (error) {
  setError("Unable to connect to the server. Please try again.");
}
};

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-6 sm:px-6 sm:py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl md:grid-cols-2">

        {/* Left image panel */}
        <section className="relative hidden min-h-[640px] md:block">
          <img
            src={logoHen}
            alt="Hen and fresh eggs on a poultry farm"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-green-950/95 via-green-900/35 to-green-900/25" />

          {/* Brand */}
          <Link
            to="/"
            className="absolute left-8 top-8 z-10 rounded-md text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-lime-300"
          >
            <span className="text-3xl font-extrabold tracking-tight">
              Enqu<span className="text-lime-300">lalie</span>
            </span>

            <span className="mt-1 block text-sm text-green-50">
              Connecting farms to markets
            </span>
          </Link>

          {/* Image message */}
          <div className="absolute bottom-10 left-8 right-8 text-white">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
              <ShieldCheck size={15} />
              Your poultry marketplace
            </span>

            <h1 className="mt-5 text-3xl font-bold leading-tight lg:text-4xl">
              Welcome Back to Enqulalie
            </h1>

            <p className="mt-4 max-w-sm text-sm leading-6 text-green-50 sm:text-base">
              Connect with poultry farmers, discover quality products,
              and grow your business in Ethiopia.
            </p>
          </div>
        </section>

        {/* Right login panel */}
        <section className="flex min-w-0 flex-col justify-center px-5 py-8 sm:px-10 sm:py-12 lg:px-12">

          {/* Mobile brand */}
          <Link
            to="/"
            className="mb-7 inline-block text-center text-2xl font-extrabold tracking-tight text-green-800 md:hidden"
          >
            Enqu<span className="text-green-500">lalie</span>
          </Link>

          {/* Heading */}
          <div className="mb-7">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Login to your account
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Welcome back! Enter your details to continue.
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-5">

            {/* Email */}
            <div>
              <label
                htmlFor="login-email"
                className="mb-2 block text-sm font-semibold text-gray-700"
              >
                Email address
              </label>

              <div className="relative">
                <Mail
                  aria-hidden="true"
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    setError("");
                    setMessage("");
                  }}
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-green-600 focus:ring-4 focus:ring-green-100"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <div className="mb-2 flex items-center justify-between gap-3">
                <label
                  htmlFor="login-password"
                  className="text-sm font-semibold text-gray-700"
                >
                  Password
                </label>

                <Link
                  to="/forgot-password"
                  className="text-xs font-semibold text-green-700 transition hover:text-green-900 sm:text-sm"
                >
                  Forgot password?
                </Link>
              </div>

              <div className="relative">
                <LockKeyhole
                  aria-hidden="true"
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError("");
                    setMessage("");
                  }}
                  autoComplete="current-password"
                  required
                  className="w-full rounded-lg border border-gray-300 bg-white py-3 pl-11 pr-12 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-green-600 focus:ring-4 focus:ring-green-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((previous) => !previous)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 transition hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                >
                  {showPassword ? (
                    <EyeOff size={19} />
                  ) : (
                    <Eye size={19} />
                  )}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <label className="flex w-fit cursor-pointer items-center gap-2.5 text-sm text-gray-600">
              <input
                type="checkbox"
                name="rememberMe"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="h-4 w-4 cursor-pointer rounded border-gray-300 accent-green-600 focus-visible:ring-2 focus-visible:ring-green-500"
              />

              Remember me
            </label>

            {/* Error message */}
            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm text-red-700"
              >
                {error}
              </p>
            )}

            {/* Informational message */}
            {message && (
              <p
                role="status"
                className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2.5 text-sm leading-5 text-amber-800"
              >
                {message}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="group flex w-full items-center justify-center gap-2 rounded-lg bg-green-700 px-4 py-3.5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-200 active:scale-[0.99]"
            >
              Login
              <ArrowRight
                size={17}
                className="transition-transform group-hover:translate-x-1"
              />
            </button>
          </form>

          {/* Registration */}
          <p className="mt-7 text-center text-sm text-gray-600">
            Don't have an account?{" "}
            <Link
              to="/register"
              className="font-bold text-green-700 transition hover:text-green-900"
            >
              Create an account
            </Link>
          </p>

          {/* Terms */}
          <p className="mt-6 text-center text-xs leading-5 text-gray-400">
            By continuing, you agree to our{" "}
            <Link
              to="/terms"
              className="underline underline-offset-2 transition hover:text-green-700"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              to="/privacy"
              className="underline underline-offset-2 transition hover:text-green-700"
            >
              Privacy Policy
            </Link>.
          </p>

          {/* Return to homepage */}
          <Link
            to="/"
            className="mt-6 self-center text-xs font-medium text-gray-500 transition hover:text-green-700"
          >
            ← Back to homepage
          </Link>
        </section>
      </div>
    </main>
  );
}

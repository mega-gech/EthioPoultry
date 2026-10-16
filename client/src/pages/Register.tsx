
import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
  Store,
  ShoppingBasket,
  CheckCircle2,
} from "lucide-react";

import logoHen from "../assets/logo_hen.jpg";

type AccountRole = "buyer" | "seller";

type RegisterFormData = {
  fullName: string;
  email: string;
  phone: string;
  role: AccountRole;
  password: string;
  confirmPassword: string;
};

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState<RegisterFormData>({
    fullName: "",
    email: "",
    phone: "",
    role: "buyer",
    password: "",
    confirmPassword: "",
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (
    e: ChangeEvent<HTMLInputElement>
  ) => {
    const { name, value } = e.target;

    setFormData((previous) => ({
      ...previous,
      [name]: value,
    }));

    setError("");
    setMessage("");
  };

  const handleRoleChange = (role: AccountRole) => {
    setFormData((previous) => ({
      ...previous,
      role,
    }));

    setError("");
    setMessage("");
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    setError("");
    setMessage("");

    const fullName = formData.fullName.trim();
    const email = formData.email.trim();

    if (fullName.length < 2) {
      setError("Please enter your full name.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Your password must contain at least 8 characters.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match. Please try again.");
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to the Terms of Service and Privacy Policy.");
      return;
    }

    // TODO: Send the registration data to your backend API.
    // Do not treat frontend validation as successful registration.

    setIsSubmitting(true);

    try {
      // Temporary demonstration until the backend is connected.
      setMessage(
        `Your form is valid for a ${formData.role} account. Backend registration is not connected yet.`
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const inputClass =
    "w-full rounded-lg border border-gray-300 bg-white py-3 pl-11 pr-4 text-sm text-gray-900 outline-none transition placeholder:text-gray-400 hover:border-gray-400 focus:border-green-600 focus:ring-4 focus:ring-green-100";

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-6 sm:px-6 sm:py-10">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl md:grid-cols-2">

        {/* Left image panel */}
        <section className="relative hidden min-h-[760px] md:block">
          <img
            src={logoHen}
            alt="Hen and eggs on a poultry farm"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-green-950/95 via-green-900/30 to-green-900/25" />

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

          {/* Welcome message */}
          <div className="absolute bottom-10 left-8 right-8 text-white">
            <span className="inline-block rounded-full border border-white/20 bg-white/10 px-3 py-1.5 text-xs font-medium backdrop-blur-sm">
              Join our community
            </span>

            <h1 className="mt-5 text-3xl font-bold leading-tight lg:text-4xl">
              Grow Together with Enqulalie
            </h1>

            <p className="mt-4 text-sm leading-6 text-green-50 lg:text-base">
              Discover fresh poultry products, connect directly with
              farmers, and grow your business in Ethiopia.
            </p>

            <div className="mt-6 space-y-3 text-sm text-green-50">
              <p className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-lime-300" />
                Connect with buyers and sellers
              </p>

              <p className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-lime-300" />
                Discover poultry products
              </p>

              <p className="flex items-center gap-2">
                <CheckCircle2 size={17} className="text-lime-300" />
                Grow your poultry business
              </p>
            </div>
          </div>
        </section>

        {/* Registration panel */}
        <section className="flex min-w-0 flex-col justify-center px-5 py-8 sm:px-10 sm:py-10 lg:px-12">

          {/* Mobile brand */}
          <Link
            to="/"
            className="mb-6 inline-block text-center text-2xl font-extrabold tracking-tight text-green-800 md:hidden"
          >
            Enqu<span className="text-green-500">lalie</span>
          </Link>

          {/* Heading */}
          <div className="mb-6">
            <h2 className="text-2xl font-bold tracking-tight text-gray-900 sm:text-3xl">
              Create an account
            </h2>

            <p className="mt-2 text-sm leading-6 text-gray-500">
              Join Enqulalie as a buyer or seller.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full name */}
            <div>
              <label
                htmlFor="register-name"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Full name
              </label>

              <div className="relative">
                <UserRound
                  aria-hidden="true"
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="register-name"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  minLength={2}
                  maxLength={100}
                  autoComplete="name"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="register-email"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
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
                  id="register-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  autoCapitalize="none"
                  spellCheck={false}
                  className={inputClass}
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="register-phone"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Phone number
              </label>

              <div className="relative">
                <Phone
                  aria-hidden="true"
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="register-phone"
                  name="phone"
                  type="tel"
                  placeholder="e.g. +251 9XX XXX XXX"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  autoComplete="tel"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Account role */}
            <fieldset>
              <legend className="mb-2 text-sm font-semibold text-gray-700">
                I want to join as a
              </legend>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  aria-pressed={formData.role === "buyer"}
                  onClick={() => handleRoleChange("buyer")}
                  className={`flex min-h-12 items-center justify-center gap-2 rounded-lg border p-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-100 ${
                    formData.role === "buyer"
                      ? "border-green-700 bg-green-50 text-green-800 ring-1 ring-green-700"
                      : "border-gray-300 text-gray-600 hover:border-green-500 hover:bg-green-50/50"
                  }`}
                >
                  <ShoppingBasket size={18} />
                  Buyer
                </button>

                <button
                  type="button"
                  aria-pressed={formData.role === "seller"}
                  onClick={() => handleRoleChange("seller")}
                  className={`flex min-h-12 items-center justify-center gap-2 rounded-lg border p-3 text-sm font-semibold transition focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-100 ${
                    formData.role === "seller"
                      ? "border-green-700 bg-green-50 text-green-800 ring-1 ring-green-700"
                      : "border-gray-300 text-gray-600 hover:border-green-500 hover:bg-green-50/50"
                  }`}
                >
                  <Store size={18} />
                  Seller
                </button>
              </div>

              <p className="mt-2 text-xs leading-5 text-gray-500">
                {formData.role === "buyer"
                  ? "Find poultry products and connect with sellers."
                  : "List poultry products and connect with buyers."}
              </p>
            </fieldset>

            {/* Password */}
            <div>
              <label
                htmlFor="register-password"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Password
              </label>

              <div className="relative">
                <LockKeyhole
                  aria-hidden="true"
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="register-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className={`${inputClass} pr-12`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword((previous) => !previous)
                  }
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 transition hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                >
                  {showPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>

              <p className="mt-1.5 text-xs text-gray-500">
                Use at least 8 characters.
              </p>
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="register-confirm-password"
                className="mb-1.5 block text-sm font-semibold text-gray-700"
              >
                Confirm password
              </label>

              <div className="relative">
                <LockKeyhole
                  aria-hidden="true"
                  size={18}
                  className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="register-confirm-password"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className={`${inputClass} pr-12`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((previous) => !previous)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  aria-pressed={showConfirmPassword}
                  className="absolute right-3 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-500 transition hover:text-green-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-green-500"
                >
                  {showConfirmPassword ? (
                    <EyeOff size={18} />
                  ) : (
                    <Eye size={18} />
                  )}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="flex items-start gap-2.5">
              <input
                id="register-terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => {
                  setAgreeTerms(e.target.checked);
                  setError("");
                  setMessage("");
                }}
                className="mt-1 h-4 w-4 shrink-0 cursor-pointer rounded accent-green-700 focus-visible:ring-2 focus-visible:ring-green-500"
              />

              <label
                htmlFor="register-terms"
                className="text-sm leading-5 text-gray-600"
              >
                I agree to the{" "}
                <Link
                  to="/terms"
                  className="font-medium text-green-700 underline underline-offset-2 hover:text-green-900"
                >
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link
                  to="/privacy"
                  className="font-medium text-green-700 underline underline-offset-2 hover:text-green-900"
                >
                  Privacy Policy
                </Link>.
              </label>
            </div>

            {/* Error */}
            {error && (
              <p
                role="alert"
                className="rounded-lg border border-red-200 bg-red-50 px-3 py-2.5 text-sm leading-5 text-red-700"
              >
                {error}
              </p>
            )}

            {/* Status */}
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
              disabled={isSubmitting}
              className="flex min-h-12 w-full items-center justify-center rounded-lg bg-green-700 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-green-800 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-green-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSubmitting ? "Please wait..." : "Create Account"}
            </button>
          </form>

          {/* Login link */}
          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-bold text-green-700 transition hover:text-green-900"
            >
              Login
            </Link>
          </p>

          {/* Homepage link */}
          <Link
            to="/"
            className="mt-5 self-center text-xs font-medium text-gray-500 transition hover:text-green-700"
          >
            ← Back to homepage
          </Link>
        </section>
      </div>
    </main>
  );
}

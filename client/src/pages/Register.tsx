 
import { useState } from "react";
import logoHen from '../assets/logo_hen.jpg'
import { Link, useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
  Store,
  ShoppingBasket,
} from "lucide-react";

export default function Register() {
  const navigate = useNavigate();

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    role: "buyer",
    password: "",
    confirmPassword: "",
  });

  const [agreeTerms, setAgreeTerms] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (formData.password.length < 8) {
      setError("Password must contain at least 8 characters.");
      return;
    }

    if (!agreeTerms) {
      setError("Please agree to the Terms of Service.");
      return;
    }

    // Registration will be connected to the backend later.
    console.log({
      fullName: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      role: formData.role,
      password: formData.password,
    });

    alert("Form validated! Backend registration is not connected yet.");
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="w-full max-w-5xl overflow-hidden rounded-2xl bg-white shadow-xl md:grid md:grid-cols-2">

        {/* Left image panel */}
        <div className="relative hidden min-h-[700px] md:block">
          <img
            src={logoHen}
            alt="Hen and eggs on a poultry farm"
            className="absolute inset-0 h-full w-full object-cover"
          />

          <div className="absolute inset-0 bg-gradient-to-t from-green-950/90 via-green-900/20 to-green-900/30" />

          <div className="absolute inset-x-0 top-8 text-center text-white">
            <h1 className="text-3xl font-bold">
              Ethio<span className="text-lime-300">Poultry</span>
            </h1>
            <p className="mt-1 text-sm">
              Connecting farms to markets
            </p>
          </div>

          <div className="absolute bottom-10 left-7 right-7 text-white">
            <h2 className="text-3xl font-bold leading-tight">
              Join the EthioPoultry Community
            </h2>
            <p className="mt-3 text-green-50">
              Connect with poultry farmers, discover fresh products,
              and grow your business with us.
            </p>
          </div>
        </div>

        {/* Registration form */}
        <div className="flex flex-col justify-center px-6 py-10 sm:px-10 lg:px-12">
          <div className="mb-7 text-center">
            <h2 className="text-3xl font-bold text-gray-900">
              Create an account
            </h2>
            <p className="mt-2 text-sm text-gray-500">
              Join EthioPoultry as a buyer or seller.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Full name */}
            <div>
              <label
                htmlFor="fullName"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Full name
              </label>

              <div className="relative">
                <UserRound
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  placeholder="Enter your full name"
                  value={formData.fullName}
                  onChange={handleChange}
                  required
                  autoComplete="name"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-gray-700"
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
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  autoComplete="email"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>

            {/* Phone */}
            <div>
              <label
                htmlFor="phone"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Phone number
              </label>

              <div className="relative">
                <Phone
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  placeholder="e.g. +251 9XX XXX XXX"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  autoComplete="tel"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-4 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />
              </div>
            </div>

            {/* Account type */}
            <div>
              <label
                htmlFor="role"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                I want to join as a
              </label>

              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, role: "buyer" }))
                  }
                  className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition ${
                    formData.role === "buyer"
                      ? "border-green-700 bg-green-50 text-green-800 ring-1 ring-green-700"
                      : "border-gray-300 text-gray-600 hover:border-green-500"
                  }`}
                >
                  <ShoppingBasket size={18} />
                  Buyer
                </button>

                <button
                  type="button"
                  onClick={() =>
                    setFormData((prev) => ({ ...prev, role: "seller" }))
                  }
                  className={`flex items-center justify-center gap-2 rounded-lg border p-3 text-sm font-medium transition ${
                    formData.role === "seller"
                      ? "border-green-700 bg-green-50 text-green-800 ring-1 ring-green-700"
                      : "border-gray-300 text-gray-600 hover:border-green-500"
                  }`}
                >
                  <Store size={18} />
                  Seller
                </button>
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-gray-700"
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
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 8 characters"
                  value={formData.password}
                  onChange={handleChange}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-11 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Confirm password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-medium text-gray-700"
              >
                Confirm password
              </label>

              <div className="relative">
                <LockKeyhole
                  size={18}
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                />

                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  required
                  autoComplete="new-password"
                  className="w-full rounded-lg border border-gray-300 py-2.5 pl-10 pr-11 outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword(!showConfirmPassword)
                  }
                  aria-label={
                    showConfirmPassword
                      ? "Hide confirm password"
                      : "Show confirm password"
                  }
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
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
            <div className="flex items-start gap-2">
              <input
                id="terms"
                type="checkbox"
                checked={agreeTerms}
                onChange={(e) => setAgreeTerms(e.target.checked)}
                className="mt-1 h-4 w-4 accent-green-700"
              />

              <label
                htmlFor="terms"
                className="text-sm text-gray-600"
              >
                I agree to the Terms of Service and Privacy Policy.
              </label>
            </div>

            {/* Error message */}
            {error && (
              <p role="alert" className="text-sm text-red-600">
                {error}
              </p>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full rounded-lg bg-green-700 py-3 font-semibold text-white transition hover:bg-green-800 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
            >
              Create Account
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-gray-600">
            Already have an account?{" "}
            <Link
              to="/login"
              className="font-semibold text-green-700 hover:text-green-900"
            >
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
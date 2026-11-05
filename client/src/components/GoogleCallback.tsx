
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyGoogleLogin = async () => {
      try {
        const response = await fetch(
          "http://localhost:5000/api/auth/me",
          {
            method: "GET",
            credentials: "include",
          }
        );

        const data = await response.json();

        if (!response.ok || !data.success || !data.user) {
          setError(data.message || "Google authentication failed.");
          return;
        }

        if (data.user.role === "buyer") {
          navigate("/buyer/dashboard", { replace: true });
        } else if (data.user.role === "seller") {
          navigate("/seller/dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } catch {
        setError("Unable to verify your Google login. Please try again.");
      }
    };

    verifyGoogleLogin();
  }, [navigate]);

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md rounded-xl bg-white p-8 text-center shadow-lg">
        {!error ? (
          <>
            <div className="mx-auto mb-5 h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-700" />

            <h1 className="text-xl font-bold text-gray-900">
              Completing Google Login
            </h1>

            <p className="mt-2 text-sm text-gray-500">
              Please wait while we verify your account.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-xl font-bold text-red-700">
              Authentication Failed
            </h1>

            <p className="mt-3 text-sm text-gray-600">
              {error}
            </p>

            <button
              onClick={() => navigate("/login", { replace: true })}
              className="mt-6 rounded-lg bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800"
            >
              Return to Login
            </button>
          </>
        )}
      </div>
    </main>
  );
}

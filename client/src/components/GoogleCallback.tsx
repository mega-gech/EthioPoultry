import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function GoogleCallback() {
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const { refreshUser } = useAuth();      

  useEffect(() => {
    const verifyGoogleLogin = async () => {
      try {
        const currentUser = await refreshUser();

        if (!currentUser) {
          setError("Google authentication failed. Please try again.");
          return;
        }

        if (currentUser.role === "buyer") {
          navigate("/buyer/dashboard", { replace: true });
        } else if (currentUser.role === "seller") {
          navigate("/seller/dashboard", { replace: true });
        } else {
          navigate("/", { replace: true });
        }
      } catch {
        setError("Unable to verify your Google login. Please try again.");
      }
    };

    // Actually execute the verification function
    verifyGoogleLogin();
  }, [navigate, refreshUser]);

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

            <p className="mt-3 text-sm text-gray-600">{error}</p>

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
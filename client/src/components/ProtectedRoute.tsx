import { Navigate, Outlet } from "react-router-dom";

type ProtectedRouteProps = {
  allowedRole: "buyer" | "seller";
};

export default function ProtectedRoute({
  allowedRole,
}: ProtectedRouteProps) {
  const token = localStorage.getItem("token");
  const savedUser = localStorage.getItem("user");

  if (!token || !savedUser) {
    return <Navigate to="/login" replace />;
  }

  try {
    const user = JSON.parse(savedUser);

    if (user.role !== allowedRole) {
      return <Navigate to="/" replace />;
    }

    return <Outlet />;
  } catch {
    localStorage.removeItem("token");
    localStorage.removeItem("user");

    return <Navigate to="/login" replace />;
  }
}
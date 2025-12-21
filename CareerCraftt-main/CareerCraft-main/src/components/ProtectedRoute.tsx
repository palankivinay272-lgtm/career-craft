import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const userEmail = localStorage.getItem("email");

  // 👇 This will print to your browser console (F12)
  if (userEmail) {
    console.log("🔓 Access Granted: User is logged in as", userEmail);
    return <>{children}</>;
  } else {
    console.log("🔒 Access Denied: No user found. Redirecting to Login...");
    return <Navigate to="/login" replace />;
  }
};

export default ProtectedRoute;
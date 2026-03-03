import { Navigate } from "react-router-dom";
import { useAuthStore } from "../store/authStore";
import React from "react";

type ProtectedRouteProps = {
  children: React.ReactNode;
  allowedRoles?: ("ADMIN" | "TEACHER" | "STUDENT")[];
};

const ProtectedRoute = ({ children, allowedRoles }: ProtectedRouteProps) => {
  const user = useAuthStore((state) => state.user);

  if (!user) return <Navigate to={"/"} replace />;
  if (allowedRoles && !allowedRoles.includes(user?.role))
    return <Navigate to={"/"} replace />;
  return children;
};

export default ProtectedRoute;

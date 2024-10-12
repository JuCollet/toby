import { Navigate, Outlet } from "react-router";
import { AuthContext } from "./context/AuthProvider";
import { useContext } from "react";

export const AuthBoundary = () => {
  const { token, error } = useContext(AuthContext);

  if (error) {
    return <Navigate to="error" replace />;
  }

  if (!token) {
    return null;
  }

  return <Outlet />;
};

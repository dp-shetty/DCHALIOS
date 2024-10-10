import React from "react";
import { Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const token = Cookies.get("authToken");

  // If there's no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  try {
    const decodedToken = jwtDecode(token);
    const currentTime = Date.now() / 1000;

    // If the token is expired, redirect to login
    if (decodedToken.exp < currentTime) {
      return <Navigate to="/login" replace />;
    }
  } catch (error) {
    console.error("Token decoding error:", error);
    return <Navigate to="/login" replace />;
  }

  // If token is valid and not expired, render children
  return children;
};

export default ProtectedRoute;

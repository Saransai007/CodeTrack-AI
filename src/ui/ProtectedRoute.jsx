import React, { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const ProtectedRoute = ({ children }) => {
  const [isValid, setIsValid] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setIsValid(false);
      return;
    }

    try {
      const decoded = jwtDecode(token);

      const currentTime = Date.now() / 1000;

      if (decoded.exp < currentTime) {
        // Token expired
        localStorage.removeItem("token");
        setIsValid(false);
        navigate("/login");
      }
    } catch (error) {
      console.error("❌ Invalid token:", error);
      localStorage.removeItem("token");
      setIsValid(false);
    }
  }, []);

  if (!isValid) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default ProtectedRoute;

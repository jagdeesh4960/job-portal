import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate } from "react-router-dom";
import { getCurrentUser } from "../../features/auth/authThunks.js";
import RoleBasedRedirect from "./RoleBasedRedirect.jsx";

const ProtectedRoute = ({ children }) => {
  const { user } = useSelector((state) => state.auth);
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  return children;
};

export default ProtectedRoute;

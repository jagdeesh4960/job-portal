// src/components/auth/RoleBasedRedirect.jsx
import { useSelector } from "react-redux";
import { Navigate } from "react-router-dom";

const RoleBasedRedirect = () => {
  const { user } = useSelector((state) => state.auth);
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // switch (user.role) {
  //   case "admin":
  //     return <Navigate to="/common/dashboard" replace />;
  //   case "employer":
  //     return <Navigate to="/employer/dashboard" replace />;
  //   case "candidate":
  //     return <Navigate to="/candidate/dashboard" replace />;
  //   default:
  //     return <Navigate to="/unauthorized" replace />;
  // }
   return <Navigate to="/common/dashboard" replace />;
};

export default RoleBasedRedirect;

import {
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import { useSelector } from "react-redux";

import CandidateRoutes from "./routers/candidateRoutes/CandidateRoutes.jsx";
import EmployerRoutes from "./routers/employerRoutes/EmployerRoutes.jsx";
import Login from "./pages/authPage/Login.jsx";
import Register from "./pages/authPage/Register.jsx";
import ProtectedRoute from "./components/authComponent/ProtectedRoute.jsx";
import Unauthorized from "./pages/authPage/Unauthorized.jsx";
import RoleBasedRedirect from "./components/authComponent/RoleBasedRedirect.jsx";
import CommonRoutes from "./routers/commonRoutes/commonRoutes.jsx";
import Navbar from "./components/commonComponents/Navbar.jsx";
import GoogleAuthSuccess from "./pages/authPage/GoogleAuthSuccess.jsx";
import ForgotPassword from "./pages/authPage/ForgotPassword.jsx";
import ResetPassword from "./pages/authPage/ResetPassword.jsx";

const AppRoutes = () => {
  const { user } = useSelector((state) => state.auth);
  const { pathname: path } = useLocation();

  return (
    <>
      {user && path !== "/login" && path !== "/register" && <Navbar/>}
      <Routes>

        {/* Public Routes */}

        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/google-auth-success" element={<GoogleAuthSuccess />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/reset-password/:token" element={<ResetPassword />} /> 

        {/* Protected Routes */}

        <Route
          path="/"
          element={
            <ProtectedRoute>
              <RoleBasedRedirect />
            </ProtectedRoute>
          }
        />

        <Route
          path="/employer/*"
          element={
            <ProtectedRoute>
              <EmployerRoutes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/candidate/*"
          element={
            <ProtectedRoute>
              <CandidateRoutes />
            </ProtectedRoute>
          }
        />

        <Route
          path="/common/*"
          element={
            <ProtectedRoute>
              <CommonRoutes />
            </ProtectedRoute>
          }
        />
      </Routes>
    </>
  );
};

export default AppRoutes;

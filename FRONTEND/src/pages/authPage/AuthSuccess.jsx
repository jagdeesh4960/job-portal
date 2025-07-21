// src/pages/authPage/AuthSuccess.jsx
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/auth/authSlice";

const AuthSuccess = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const query = new URLSearchParams(window.location.search)
    const token = query.get("token");

    if (token) {
      localStorage.setItem("token", token);
      const user = jwtDecode(token);
      dispatch(setUser(user));

      // redirect based on role
      switch (user.role) {
        case "admin":
          navigate("/admin/dashboard");
          break;
        case "employer":
          navigate("/employer/dashboard");
          break;
        case "candidate":
          navigate("/candidate/dashboard");
          break;
        default:
          navigate("/");
      }
    } else {
      navigate("/login");
    }
  }, [navigate, dispatch]);

  return <p className="text-center mt-10 text-lg">Logging you in via Google...</p>;
};

export default AuthSuccess;

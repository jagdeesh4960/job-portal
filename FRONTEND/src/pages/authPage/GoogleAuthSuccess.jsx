import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setUser } from "../../features/auth/authSlice";
import {jwtDecode} from "jwt-decode";

const GoogleAuthSuccess = () => {
  const [params] = useSearchParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    const token = params.get("token");
    if (token) {
      const decoded = jwtDecode(token);
      dispatch(setUser(decoded.user));
      // Save token if needed: localStorage.setItem("token", token)
      
      const role = decoded.user.role || 'candidate';
      if (role === 'admin') navigate('/admin/dashboard');
      else if (role === 'employer') navigate('/employer/dashboard');
      else navigate('/candidate/dashboard');
    } else {
      navigate('/login');
    }
  }, []);

  return <p>Redirecting...</p>;
};

export default GoogleAuthSuccess;

import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { AiOutlineLock } from "react-icons/ai";
import { resetPassword } from "../../features/auth/authThunks.js";
import { useDispatch } from "react-redux";

const ResetPassword = () => {
  const dispatch = useDispatch();  
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

 const handleReset = async (e) => {
  e.preventDefault();
  setError("");
  setSuccess("");

  if (password !== confirm) {
    return setError("Passwords do not match.");
  }

  try {
    setLoading(true);
    const res = await dispatch(resetPassword({ token, password })).unwrap();
    setSuccess(res.message || "Password updated successfully. Redirecting...");
    setTimeout(() => navigate("/login"), 3000);
  } catch (err) {
    setError(err || "Something went wrong.");
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">Reset Password</h2>
        <form onSubmit={handleReset} className="space-y-4">
          <div className="relative">
            <AiOutlineLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type="password"
              placeholder="New Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <div className="relative">
            <AiOutlineLock className="absolute top-3 left-3 text-gray-400" />
            <input
              type="password"
              placeholder="Confirm Password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            {loading ? "Updating..." : "Reset Password"}
          </button>
        </form>
        {error && <p className="mt-4 text-sm text-red-600 text-center">{error}</p>}
        {success && <p className="mt-4 text-sm text-green-600 text-center">{success}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;

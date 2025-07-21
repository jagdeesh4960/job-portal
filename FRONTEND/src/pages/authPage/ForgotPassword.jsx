import React, { useState } from "react";
import { AiOutlineMail, AiOutlineCheckCircle } from "react-icons/ai";
import { forgotPassword } from "../../features/auth/authThunks";
import { useDispatch } from "react-redux";

const ForgotPassword = () => {
  const dispatch = useDispatch();
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

 const handleSubmit = async (e) => {
  e.preventDefault();
  setLoading(true);
  setMessage("");

  try {
    const res = await dispatch(forgotPassword(email)).unwrap();
    setMessage(res.message); 
  } catch (err) {
    setMessage(err); 
  } finally {
    setLoading(false);
  }
};



  return (
    <div className="min-h-screen flex items-center justify-center bg-blue-50 px-4">
      <div className="max-w-md w-full bg-white p-6 rounded-xl shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-center text-blue-800">Forgot Password</h2>
        <p className="text-sm text-gray-600 mb-6 text-center">Enter your email and we’ll send a password reset link.</p>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <AiOutlineMail className="absolute top-3 left-3 text-gray-400" />
            <input
              type="email"
              placeholder="Enter your email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700"
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
        {message && (
          <div className="mt-4 text-center text-sm text-green-600 flex items-center justify-center gap-1">
            <AiOutlineCheckCircle />
            {message}
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;

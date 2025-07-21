import React from "react";
import { useLocation, Link } from "react-router-dom";

const Unauthorized = () => {
  const location = useLocation();
  const reason = location.state?.message || "You do not have permission to access this page.";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <h1 className="text-4xl font-bold text-red-600 mb-4">Unauthorized Access</h1>
      <p className="text-gray-700 text-lg text-center mb-6">{reason}</p>
      <Link
        to="/"
        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded"
      >
        Go Back to Home
      </Link>
    </div>
  );
};

export default Unauthorized;

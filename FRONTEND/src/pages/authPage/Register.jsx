import { useState } from "react";
import { motion } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "../../features/auth/authThunks";
import { useNavigate } from "react-router-dom";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';


const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "",
    adminKey: "",
    phone: "",
  });



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (name === "role") {
      setShowAdminKey(value.toLowerCase() === "admin");
    }
  };

  const handleSubmit = (e) => {
    if (!formData.phone || !/^\+\d{10,15}$/.test(formData.phone)) {
      alert("Please enter a valid phone number with country code.");
      return;
    }

    e.preventDefault();
    dispatch(
      registerUser(formData)

    );
    navigate('/common/dashboard');
  };

  const handleGoogleLogin = () => {
    window.open("http://localhost:3000/api/auth/google", "_self");
  };


  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-300 p-4">
      <motion.form
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        onSubmit={handleSubmit}
        className="bg-white shadow-xl rounded-2xl p-8 w-full max-w-md"
      >
        <h2 className="text-2xl font-bold text-center mb-6 text-blue-700">
          Register for Jobs Portal
        </h2>

        {error && (
          <div className="text-red-600 mb-4 text-sm text-center">{error}</div>
        )}

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Full Name</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Phone Number</label>
          <PhoneInput
            country={'in'}
            value={String(formData.phone || '').replace('+', '')}
            onChange={(phone) => setFormData({ ...formData, phone: `+${phone}` })}
            inputProps={{
              name: 'phone',
              required: true,
            }}
            inputClass="!w-full !border !rounded-lg !px-4 !py-2 !focus:outline-none !focus:ring-2 !focus:ring-blue-400"
            containerClass="!bg-transparent"
          />
        </div>


        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          >
            <option value="" disabled>Select Role</option>
            <option value="candidate">Candidate</option>
            <option value="employer">Employer</option>
          </select>

        </div>

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          type="submit"
          className="w-full py-2 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
          disabled={loading}
        >
          {loading ? "Registering..." : "Register"}
        </motion.button>
        <div className="text-center mt-4">
          <button
            onClick={handleGoogleLogin}
            className="w-full flex items-center justify-center gap-2 py-2 px-4 bg-white border border-gray-300 text-gray-700 font-medium rounded-lg shadow hover:shadow-md transition duration-300 cursor-pointer hover:bg-gray-50"
          >
            <img
              src="https://static.dezeen.com/uploads/2025/05/sq-google-g-logo-update_dezeen_2364_col_0-852x852.jpg"
              alt="Google"
              className="h-5 w-5 object-contain"
            />
            Continue with Google
          </button>
        </div>


        <p className="text-sm text-center text-gray-600 mt-4">
          Already have an account?{" "}
          <span
            onClick={() => navigate("/login")}
            className="text-blue-600 font-semibold hover:underline cursor-pointer"
          >
            Login here
          </span>
        </p>
      </motion.form>
    </div>
  );
};

export default Register;

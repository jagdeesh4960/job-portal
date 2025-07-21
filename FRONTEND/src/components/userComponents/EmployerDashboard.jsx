import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const EmployerDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-800">
        Hello, {user?.name || 'Employer'} 🚀
      </h1>
      <p className="text-gray-600 text-lg mb-6 max-w-xl mx-auto">
        Post jobs, view applications, and manage your listings easily.
      </p>
      <Link
        to="/employer/create-job"
        className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
      >
        Create your jobs
      </Link>
    </motion.div>
  );
};

export default EmployerDashboard;

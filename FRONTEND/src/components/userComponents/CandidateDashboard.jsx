import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useSelector } from 'react-redux';

const CandidateDashboard = () => {
  const { user } = useSelector((state) => state.auth);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="text-center"
    >
      <h1 className="text-3xl md:text-5xl font-bold mb-4 text-gray-800">
        Welcome, {user?.name || 'Candidate'} 💼
      </h1>
      <p className="text-gray-600 text-lg mb-6 max-w-xl mx-auto">
        Discover and apply to your dream job or internship.
      </p>
      <Link
        to="/common/jobs"
        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
      >
        Browse Jobs
      </Link>
    </motion.div>
  );
};

export default CandidateDashboard;

import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { getAppliedJobs } from "../../features/jobs/jobThunks";
import { motion } from "framer-motion";

const AppliedJobs = () => {
  const dispatch = useDispatch();
  const { appliedJobs } = useSelector((state) => state.jobs);

  useEffect(() => {
    dispatch(getAppliedJobs());
  }, [dispatch]);

  const getStatusStyle = (status) => {
    switch (status) {
      case "Accepted":
        return "text-green-600 bg-green-100";
      case "Rejected":
        return "text-red-600 bg-red-100";
      case "Shortlisted":
        return "text-blue-600 bg-blue-100";
      case "Interview Scheduled":
        return "text-purple-600 bg-purple-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  return (
    <motion.div
      className="max-w-4xl mx-auto px-4 pt-24 pb-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h1
        className="text-3xl font-bold mb-6 text-blue-700"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Applied Jobs
      </motion.h1>

      {appliedJobs.length === 0 ? (
        <motion.p
          className="text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          You haven’t applied to any jobs yet.
        </motion.p>
      ) : (
        appliedJobs.map((e, index) => (
          <motion.div
            key={e._id}
            className="border border-gray-200 p-4 rounded-xl mb-4 shadow-sm bg-white hover:shadow-md transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <h3 className="text-xl font-semibold text-gray-800">{e.job.title}</h3>
            <p className="text-gray-600">{e.job.company}</p>
            <p className="text-gray-500 text-sm">{e.job.location}</p>

            <div className="mt-2 text-sm">
              <span className={`inline-block px-3 py-1 rounded-full font-medium ${getStatusStyle(e.status)}`}>
                Status: {e.status}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 mt-4">
              <Link
                to={`/common/job/${e.job._id}`}
                className="text-blue-500 hover:underline text-sm"
              >
                View Details →
              </Link>
            </div>
          </motion.div>
        ))
      )}
    </motion.div>
  );
};

export default AppliedJobs;

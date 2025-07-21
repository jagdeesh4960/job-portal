import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getSavedJobs, removeSaveJob } from '../../features/jobs/jobThunks';
import { motion } from 'framer-motion';

const SavedJobs = () => {
  const { savedJobs } = useSelector((state) => state.jobs);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getSavedJobs());
  }, [dispatch]);

  const handleRemove = (id) => {
    dispatch(removeSaveJob(id));
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
        Saved Jobs
      </motion.h1>

      {savedJobs.length === 0 ? (
        <motion.p
          className="text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
        >
          You have no saved jobs.
        </motion.p>
      ) : (
        savedJobs.map((e, index) => (
          <motion.div
            key={e.job._id}
            className="border border-gray-200 shadow-sm p-4 rounded-xl mb-4 bg-white hover:shadow-md transition-all"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
          >
            <h3 className="text-xl font-semibold text-gray-800">{e.job.title}</h3>
            <p className="text-gray-600">{e.job.company}</p>

            <div className="flex flex-col sm:flex-row gap-4 sm:items-center mt-4">
              <button
                onClick={() => handleRemove(e.job._id)}
                className="text-red-600 hover:underline text-sm"
              >
                Remove
              </button>
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

export default SavedJobs;

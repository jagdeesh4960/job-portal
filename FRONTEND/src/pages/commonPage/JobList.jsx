import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSearchTerm, setJobTypeFilter } from '../../features/jobs/JobSlice';
import JobCard from '../../components/commonComponents/jobCard';
import Fuse from 'fuse.js';
import useDebounce from '../../hooks/useDebounce';
import { fetchAllJobs } from '../../features/jobs/jobThunks';
import { motion, AnimatePresence } from 'framer-motion';

const JobList = () => {
  const dispatch = useDispatch();
  const { jobs, searchTerm, jobTypeFilter } = useSelector((state) => state.jobs);
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  useEffect(() => {
    dispatch(fetchAllJobs());
  }, [dispatch]);

  const fuse = new Fuse(jobs, {
    keys: ['title', 'company', 'location'],
    threshold: 0.3,
    includeScore: true,
  });

  const fuseResults = debouncedSearchTerm
    ? fuse.search(debouncedSearchTerm).map((result) => result.item)
    : jobs;

  const filteredJobs = fuseResults.filter((job) => {
    const type = job.type || '';
    const matchesType =
      jobTypeFilter === 'All' || jobTypeFilter === 'Latest'
        ? true
        : type === jobTypeFilter;

    return matchesType;
  });

  return (
    <motion.div
      className="max-w-5xl mx-auto px-4 pt-24 pb-8"
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
        Available Jobs & Internships
      </motion.h1>

      <motion.div
        className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <input
          type="text"
          placeholder="Search by job title, company, or location..."
          className="border px-4 py-2 rounded-md w-full md:w-1/2 text-sm"
          value={searchTerm}
          onChange={(e) => dispatch(setSearchTerm(e.target.value))}
        />

        <select
          className="border px-4 py-2 rounded-md text-sm"
          value={jobTypeFilter}
          onChange={(e) => dispatch(setJobTypeFilter(e.target.value))}
        >
          <option value="All">All Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
          <option value="Latest">Latest</option>
        </select>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AnimatePresence>
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ delay: index * 0.05 }}
              >
                <JobCard job={job} />
              </motion.div>
            ))
          ) : (
            <motion.p
              className="text-gray-500 text-sm col-span-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              No jobs found matching your criteria.
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
};

export default JobList;

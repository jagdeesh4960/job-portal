import React, { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Fuse from "fuse.js";
import useDebounce from "../../hooks/useDebounce";
import { fetchAllApplications, updateStatus } from "../../features/applications/applicationThunks.js";
import { fetchAllJobs } from "../../features/jobs/jobThunks.js";

const Applications = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { applications } = useSelector((state) => state.applications);
  const { jobs } = useSelector((state) => state.jobs);

  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 300);
  const [statusFilter, setStatusFilter] = useState("All");
  const [jobTypeFilter, setJobTypeFilter] = useState("All");
  const [updatingStatus, setUpdatingStatus] = useState({ id: null, status: null });
  const [statusSuccessMap, setStatusSuccessMap] = useState({});


  useEffect(() => {
    dispatch(fetchAllApplications()).unwrap().catch(console.error);
    dispatch(fetchAllJobs()).unwrap().catch(console.error);
  }, [dispatch]);

  const employerJobs = useMemo(
    () => jobs.filter((job) => job.authorId === user?._id || job.authorId === user?.email),
    [jobs, user]
  );
  const employerJobIds = useMemo(() => employerJobs.map((job) => job._id), [employerJobs]);

  const fuse = new Fuse(applications, {
    keys: ['job.title', 'job.company'],
    threshold: 0.3,
    includeScore: true,
    includeMatches: true,
  });

  const fuseResults = debouncedSearchTerm
    ? fuse.search(debouncedSearchTerm)
    : applications.map((app) => ({ item: app }));

  const filteredApplications = useMemo(() => {
    return fuseResults
      .filter(({ item }) => item?.job && employerJobIds.includes(item.job._id))
      .filter(({ item }) => {
        const statusMatch = statusFilter === "All" || item.status === statusFilter;
        const jobTypeMatch =
          jobTypeFilter === "All" ||
          employerJobs.find((job) => job._id === item.job._id)?.type === jobTypeFilter;
        return statusMatch && jobTypeMatch;
      });
  }, [fuseResults, employerJobIds, statusFilter, jobTypeFilter, employerJobs]);

  const handleStatusChange = async (app, newStatus) => {
    if (app.status === newStatus || updatingStatus.id === app._id) return;

    setUpdatingStatus({ id: app._id, status: newStatus });
    setStatusSuccessMap((prev) => ({ ...prev, [app._id]: false }));

    try {
      await dispatch(updateStatus({ applicationId: app._id, status: newStatus })).unwrap();
      setStatusSuccessMap((prev) => ({ ...prev, [app._id]: true }));
      setTimeout(() => {
        setStatusSuccessMap((prev) => ({ ...prev, [app._id]: false }));
      }, 1500);
    } catch (error) {
      console.error("Failed to update application status:", error);
    } finally {
      setUpdatingStatus({ id: null, status: null });
    }
  };



  const highlightText = (text, matches, key) => {
    if (!matches) return text;
    const match = matches.find((m) => m.key === key);
    if (!match) return text;
    const indices = match.indices;
    let result = "";
    let lastIndex = 0;
    indices.forEach(([start, end]) => {
      result += text.slice(lastIndex, start);
      result += `<mark class='bg-yellow-200 font-semibold'>${text.slice(start, end + 1)}</mark>`;
      lastIndex = end + 1;
    });
    result += text.slice(lastIndex);
    return result;
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.12 } },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 },
  };

  const buttonTap = { scale: 0.95 };

  return (
    <div className="pt-[72px] px-4 sm:px-6 lg:px-12 pb-12 max-w-screen-xl mx-auto min-h-[calc(100vh-72px)]">
      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-3xl sm:text-4xl font-bold text-blue-700 mb-8 text-center"
      >
        Applications for Your Jobs
      </motion.h1>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 mb-10"
      >
        <motion.input
          type="text"
          placeholder="Search by title or company"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          whileFocus={{ scale: 1.02 }}
        />
        <motion.select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          whileFocus={{ scale: 1.02 }}
        >
          <option value="All">All Statuses</option>
          <option value="Applied">Applied</option>
          <option value="Shortlisted">Shortlisted</option>
          <option value="Accepted">Accepted</option>
          <option value="Rejected">Rejected</option>
        </motion.select>
        <motion.select
          value={jobTypeFilter}
          onChange={(e) => setJobTypeFilter(e.target.value)}
          className="border p-3 rounded-md w-full focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
          whileFocus={{ scale: 1.02 }}
        >
          <option value="All">All Job Types</option>
          <option value="Full-time">Full-time</option>
          <option value="Part-time">Part-time</option>
          <option value="Internship">Internship</option>
          <option value="Contract">Contract</option>
        </motion.select>
      </motion.div>

      <AnimatePresence>
        {filteredApplications.length === 0 ? (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center text-gray-500 text-lg mt-12"
          >
            No applications found.
          </motion.p>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-8"
          >
            {filteredApplications.map(({ item, matches }) => (
              <motion.div
                key={item._id}
                variants={cardVariants}
                className="bg-white border border-gray-200 shadow-md rounded-xl p-5 hover:shadow-lg transition relative flex flex-col"
                whileHover={{ scale: 1.03 }}
              >
                <h3
                  className="text-xl font-semibold text-blue-800 mb-1"
                  dangerouslySetInnerHTML={{
                    __html: highlightText(item.job.title, matches, 'job.title'),
                  }}
                ></h3>
                <p
                  className="text-gray-700 mb-1"
                  dangerouslySetInnerHTML={{
                    __html: highlightText(item.job.company, matches, 'job.company'),
                  }}
                ></p>
                <p className="text-gray-700 mb-1">Email: {item.formDetails.email}</p>
                {item.formDetails.phone && <p className="text-gray-700 mb-1">Phone: {item.formDetails.phone}</p>}
                {item.applicant.linkedin && (
                  <p className="mb-1">
                    LinkedIn: <a href={item.applicant.linkedin} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">{item.applicant.linkedin}</a>
                  </p>
                )}
                {item.applicant.github && (
                  <p className="mb-1">
                    GitHub: <a href={item.applicant.github} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">{item.applicant.github}</a>
                  </p>
                )}
                {item.applicant.resumeUrl && (
                  <p className="mb-3">
                    Resume: <a href={item.applicant.resumeUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline hover:text-blue-800">View Resume</a>
                  </p>
                )}
                <p className="mt-auto font-semibold">
                  Status: <motion.span
                    key={item.status}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ type: "spring", stiffness: 260, damping: 20 }}
                    className={
                      item.status === "Accepted"
                        ? "text-green-600"
                        : item.status === "Rejected"
                          ? "text-red-600"
                          : item.status === "Shortlisted"
                            ? "text-blue-600"
                            : "text-yellow-600"
                    }
                  >
                    {item.status}
                  </motion.span>
                </p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {["Applied", "Shortlisted", "Accepted", "Rejected"].map((status) => {
                    const isUpdating = updatingStatus.id === item._id && updatingStatus.status === status;
                    const isSuccess = statusSuccessMap[item._id] && item.status === status;

                    return (
                      <motion.button
                        key={status}
                        onClick={() => handleStatusChange(item, status)}
                        disabled={isUpdating}
                        className={`px-4 py-1 rounded-full text-sm font-medium flex items-center gap-2 transition ${item.status === status
                            ? "bg-blue-600 text-white shadow-md"
                            : "bg-gray-100 hover:bg-gray-200"
                          } ${isUpdating ? "opacity-50 cursor-not-allowed" : ""}`}
                        whileTap={buttonTap}
                        aria-pressed={item.status === status}
                      >
                        {isUpdating ? (
                          <svg className="animate-spin h-4 w-4 text-gray-600" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                          </svg>
                        ) : isSuccess ? (
                          <svg className="h-4 w-4 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                          </svg>
                        ) : null}
                        {status}
                      </motion.button>
                    );
                  })}

                </div>
                <Link to={`/common/view-application/${item._id}`} className="mt-4 inline-block text-indigo-600 hover:underline text-sm font-medium">
                  View Full Application
                </Link>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Applications;






















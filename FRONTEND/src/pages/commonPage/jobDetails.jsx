import React, { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllJobs } from "../../features/jobs/jobThunks";
import { cancelApplication } from "../../features/applications/applicationThunks";
import { motion } from "framer-motion";

const JobDetail = () => {
  const dispatch = useDispatch();
  const { jobId } = useParams();
  const { user } = useSelector((state) => state.auth);
  const navigate = useNavigate();

  const job = useSelector((state) =>
    state.jobs.jobs.find((j) => j._id.toString() === jobId.toString())
  );
  const appliedJobs = useSelector((state) => state.jobs.appliedJobs);
  const currentUser = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchAllJobs());
  }, [dispatch]);

  const hasApplied = appliedJobs.some(
    (e) => e.job._id.toString() === jobId.toString()
  );

  const isAuthor =
    currentUser?._id && job?.authorId
      ? currentUser._id.toString() === job.authorId.toString()
      : false;

  const handleApply = () => {
    navigate(`/common/apply/${job._id}`);
  };

  const handleCancel = () => {
    alert("Application canceled.");
    dispatch(cancelApplication(job._id));
    navigate(`/candidate/applied-jobs`);
  };

  if (!job) {
    return (
      <div className="text-center pt-[6rem] px-4">
        <h2 className="text-xl text-red-600">Job not found.</h2>
        <button
          onClick={() => navigate("/jobs")}
          className="mt-4 text-blue-500 underline"
        >
          Back to Jobs, job has been deleted by employer.
        </button>
      </div>
    );
  }

  return (
    <motion.div
      className="max-w-3xl mx-auto px-4 pt-[6rem] pb-10"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
    >
      <h1 className="text-3xl sm:text-4xl font-bold text-blue-700 mb-2">{job.title}</h1>
      <p className="text-lg font-medium text-gray-800">{job.company}</p>
      <p className="text-gray-500 mb-4">
        {job.location} | {job.type} | {job.salary}
      </p>

      <p className="text-gray-700 mb-6 leading-relaxed">{job.description}</p>

      {Array.isArray(job.requirements) && job.requirements.length > 0 && (
        <>
          <h3 className="font-semibold text-lg mb-2">Requirements:</h3>
          <ul className="list-disc list-inside text-gray-600 mb-6">
            {job.requirements.map((req, index) => (
              <li key={index}>{req}</li>
            ))}
          </ul>
        </>
      )}

      <div className="flex flex-col sm:flex-row gap-4">
        {(!isAuthor &&user.role !== "employer") && 
          (hasApplied ? (
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              className="bg-red-600 text-white px-5 py-2 rounded hover:bg-red-700 transition"
              onClick={handleCancel}
            >
              Cancel Application
            </motion.button>
          ) : (
            <motion.button
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.02 }}
              className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
              onClick={handleApply}
            >
              Apply Now
            </motion.button>
          ))}

        <motion.button
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate(-1)}
          className="text-blue-500 hover:underline"
        >
          Back
        </motion.button>
      </div>
    </motion.div>
  );
};

export default JobDetail;

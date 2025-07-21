import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";

const ViewApplication = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const { applications } = useSelector((state) => state.applications);
  const [application, setApplication] = useState(null);

  useEffect(() => {
    const foundApp = applications?.find((app) => app._id === id);
    if (foundApp) setApplication(foundApp);
  }, [applications, id]);

  if (!application)
    return (
      <div className="max-w-4xl mx-auto pt-[80px] px-4">
        <p className="text-gray-500">Loading application details...</p>
      </div>
    );

  const { applicant, job, status } = application;


  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="max-w-4xl mx-auto pt-[80px] px-4 md:px-6"
    >
      <button
        onClick={() => navigate(-1)}
        className="text-blue-600 hover:underline mb-4"
      >
        ← Back to Applications
      </button>

      <motion.h2
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="text-2xl md:text-3xl font-bold mb-6 text-blue-700"
      >
        Application Details
      </motion.h2>

      <motion.section
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-xl font-semibold mb-2">Job Information</h3>
        <div className="space-y-1 text-gray-700">
          <p><strong>Title:</strong> {job.title}</p>
          <p><strong>Company:</strong> {job.company}</p>
          <p><strong>Type:</strong> {job.type}</p>
          <p><strong>Location:</strong> {job.location}</p>
        </div>
      </motion.section>

      <motion.section
        className="mb-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-xl font-semibold mb-2">Applicant Information</h3>
        <div className="space-y-1 text-gray-700">
          <p><strong>Name:</strong> {applicant.name}</p>
          <p><strong>Email:</strong> {applicant.email}</p>
          {applicant.phone && <p><strong>Phone:</strong> {applicant.phone}</p>}
          {applicant.linkedin && (
            <p>
              <strong>LinkedIn:</strong>{" "}
              <a
                href={applicant.linkedin}
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {applicant.linkedin}
              </a>
            </p>
          )}
          {applicant.github && (
            <p>
              <strong>GitHub:</strong>{" "}
              <a
                href={applicant.github}
                className="text-blue-600 underline"
                target="_blank"
                rel="noopener noreferrer"
              >
                {applicant.github}
              </a>
            </p>
          )}
          {application.formDetails.resumeUrl && (
            <div className="mt-2">
              <strong>Resume:</strong>{" "}
              <div className="flex gap-4 mt-2">
                <a
                  href={application.formDetails.resumeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                >
                  View Resume
                </a>
                <a
                  href={application.formDetails.resumeUrl}
                  download
                  className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
                >
                  Download Resume
                </a>
              </div>
            </div>
          )}

          {application.formDetails.coverLetter && (
            <motion.section
              className="mb-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <h3 className="text-xl font-semibold mb-2">Cover Letter</h3>
              <p className="whitespace-pre-line  p-4 rounded  shadow-xl text-gray-700 ">
                {application.formDetails.coverLetter}
              </p>
            </motion.section>
          )}


        </div>
      </motion.section>

      {applicant.coverLetter && (
        <motion.section
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <h3 className="text-xl font-semibold mb-2">Cover Letter</h3>
          <p className="whitespace-pre-line bg-gray-50 p-4 rounded border text-gray-700">
            {applicant.coverLetter}
          </p>
        </motion.section>
      )}

      <motion.section
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        <h3 className="text-xl font-semibold mb-2">Application Status</h3>
        <p className="font-semibold text-lg">
          <span
            className={`${status === "Accepted"
              ? "text-green-600"
              : status === "Rejected"
                ? "text-red-600"
                : status === "Shortlisted"
                  ? "text-blue-600"
                  : "text-yellow-600"
              }`}
          >
            {status}
          </span>
        </p>
      </motion.section>
    </motion.div>
  );
};

export default ViewApplication;

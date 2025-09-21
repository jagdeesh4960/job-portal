import React from "react";
import { Link } from "react-router-dom";

import { useDispatch, useSelector } from "react-redux";
import { saveToJob } from "../../features/jobs/jobThunks.js";

// Highlight function
const highlightText = (text, term) => {
  if (!term) return text;
  const regex = new RegExp(`(${term})`, 'gi');
  return text.replace(regex, '<mark class="bg-yellow-200 text-black">$1</mark>');
};

const JobCard = ({ job }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { savedJobs, searchTerm } = useSelector((state) => state.jobs);
  
  const isSaved = savedJobs.some((j) => j.job._id.toString() === job._id.toString());
  const handleSave = () => {
    dispatch(saveToJob(job._id));
  };

  const isAuthor = user?._id?.toString() === job?.authorId?.toString();
  const search = searchTerm?.toLowerCase() || '';

  return (
    <div className="rounded-xl p-4 shadow-sm hover:shadow-md transition bg-white border border-gray-100">
      <h2
        className="text-base font-semibold text-blue-700"
        dangerouslySetInnerHTML={{
          __html: highlightText(job.title, search),
        }}
      />
      <p
        className="text-gray-600 text-sm"
        dangerouslySetInnerHTML={{
          __html: highlightText(job.company, search),
        }}
      />
      <p
        className="text-gray-500 text-xs"
        dangerouslySetInnerHTML={{
          __html: highlightText(job.location, search),
        }}
      />

      <p className="text-xs text-gray-500 mt-1">{job.type} | {job.salary}</p>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mt-4 gap-2">
        {job.authorId!==user._id&&
        <button
          onClick={!isSaved ? handleSave : null}
          disabled={isSaved}
          className={`text-xs ${
            isSaved
              ? "text-gray-400 cursor-not-allowed"
              : "text-blue-600 hover:underline"
          } cursor-pointer`}
        >
          {isSaved ? "Saved" : "Save Job"}
        </button>}

        <div className="flex gap-4 text-xs">
          {isAuthor && (
            <Link
              to={`/common/edit-job/${job._id}`}
              className="text-blue-500 hover:underline"
            >
              Edit
            </Link>
          )}
          <Link
            to={`/common/job/${job._id}`}
            className="text-blue-500 hover:underline"
          >
            View Details →
          </Link>
        </div>
      </div>
    </div>
  );
};

export default JobCard;

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { editJob } from '../../features/jobs/jobThunks.js';
import { motion } from 'framer-motion';

const EditJob = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [newRequirement, setNewRequirement] = useState("");

  const job = useSelector(state =>
    state.jobs.userPostedJobs.find(job => String(job._id) === id)
  );

  const [formData, setFormData] = useState({
    title: "",
    company: "",
    location: "",
    salary: "",
    type: "",
    description: "",
    requirements: [],
  });

  useEffect(() => {
    if (job) {
      setFormData(job);
    }
  }, [job]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(editJob({ formData, jobId: id }));
    alert('Job updated successfully!');
    navigate('/employer/posted-jobs');
  };

  if (!job) {
    return <p className="text-center mt-20 text-gray-600">Job not found</p>;
  }

  return (
    <motion.div
      className="max-w-2xl mx-auto px-4 pt-28 pb-16"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.4 }}
    >
      <motion.h2
        className="text-3xl font-bold mb-6 text-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        Edit Job
      </motion.h2>

      <motion.form
        onSubmit={handleSubmit}
        className="space-y-5"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {['title', 'company', 'location', 'salary'].map((field) => (
          <motion.input
            key={field}
            name={field}
            placeholder={field[0].toUpperCase() + field.slice(1)}
            value={formData[field]}
            onChange={handleChange}
            required
            whileFocus={{ scale: 1.02 }}
            className="w-full border px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
          />
        ))}

        <select
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
          className="w-full border px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
        >
          <option value="">Select Job Type</option>
          <option value="Full-time">Full-time</option>
          <option value="Internship">Internship</option>
          <option value="Part-time">Part-time</option>
          <option value="Contract">Contract</option>
          <option value="Remote">Remote</option>
        </select>

        <textarea
          name="description"
          placeholder="Job Description"
          value={formData.description}
          onChange={handleChange}
          required
          rows={5}
          className="w-full border px-4 py-2 rounded-md shadow-sm focus:ring-2 focus:ring-blue-400 outline-none"
        />

        {/* Requirements Input */}
        <div>
          <label className="block mb-2 font-medium text-gray-700">Requirements</label>
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <input
              type="text"
              value={newRequirement}
              onChange={(e) => setNewRequirement(e.target.value)}
              className="flex-1 border rounded px-3 py-2 shadow-sm"
              placeholder="e.g., React, Node.js, Communication skills"
            />
            <button
              type="button"
              onClick={() => {
                if (newRequirement.trim()) {
                  setFormData((prev) => ({
                    ...prev,
                    requirements: [...prev.requirements, newRequirement.trim()],
                  }));
                  setNewRequirement("");
                }
              }}
              className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
            >
              Add
            </button>
          </div>

          {formData.requirements.length > 0 && (
            <ul className="list-disc list-inside space-y-2 text-sm text-gray-700">
              {formData.requirements.map((req, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between bg-gray-100 px-3 py-2 rounded-md"
                >
                  <span>{req}</span>
                  <button
                    type="button"
                    onClick={() => {
                      setFormData((prev) => ({
                        ...prev,
                        requirements: prev.requirements.filter((_, i) => i !== index),
                      }));
                    }}
                    className="text-red-500 hover:underline text-xs"
                  >
                    Remove
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>

        <motion.button
          type="submit"
          whileTap={{ scale: 0.97 }}
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 transition"
        >
          Update Job
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default EditJob;

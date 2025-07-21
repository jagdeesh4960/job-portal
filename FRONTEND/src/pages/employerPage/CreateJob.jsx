import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { createJob } from "../../features/jobs/jobThunks";
import { motion } from "framer-motion";

const CreateJob = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);
  const [newRequirement, setNewRequirement] = useState("");

  const [formData, setFormData] = useState({
    authorId: user._id,
    title: "",
    company: "",
    location: "",
    salary: "",
    type: "",
    description: "",
    requirements: [],
  });

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.company) {
      alert("Please fill in required fields");
      return;
    }
    alert("Job post");
    dispatch(createJob(formData));
    navigate("/employer/posted-jobs");
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="pt-[50px] w-screen h-[calc(100vh-64px)] overflow-hidden px-4 md:px-8 flex items-center justify-center bg-gray-50"
    >
      <div className="bg-white w-full h-full rounded-none md:rounded-2xl shadow-none md:shadow-lg p-6 md:p-10">
        <h2 className="text-2xl md:text-3xl font-bold text-center mb-4">
          Post a New Job
        </h2>

        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-700 h-[calc(100%-3rem)] overflow-y-auto scrollbar-hide"
        >
          {[
            {
              label: "Job Title*",
              name: "title",
              placeholder: "Frontend Developer",
              required: true,
            },
            {
              label: "Company Name*",
              name: "company",
              placeholder: "Google",
              required: true,
            },
            {
              label: "Location",
              name: "location",
              placeholder: "Remote or New York",
            },
            { label: "Salary", name: "salary", placeholder: "$90k - $120k" },
          ].map(({ label, name, placeholder, required }) => (
            <div key={name} className="flex flex-col">
              <label className="mb-1">{label}</label>
              <input
                type="text"
                name={name}
                value={formData[name]}
                onChange={handleChange}
                required={required}
                placeholder={placeholder}
                className="rounded-md px-3 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          ))}

          <div className="flex flex-col col-span-full">
            <label className="mb-1">Job Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="rounded-md px-3 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select type</option>
              <option value="Full-time">Full-time</option>
              <option value="Internship">Internship</option>
              <option value="Part-time">Part-time</option>
              <option value="Contract">Contract</option>
              <option value="Remote">Remote</option>
            </select>
          </div>

          <div className="flex flex-col col-span-full">
            <label className="mb-1">Job Description</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              rows="2"
              placeholder="Short job description..."
              className="rounded-md px-3 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            ></textarea>
          </div>

          <div className="flex flex-col col-span-full">
            <label className="mb-1">Requirements</label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newRequirement}
                onChange={(e) => setNewRequirement(e.target.value)}
                placeholder="e.g. React"
                className="flex-1 rounded-md px-3 py-2 bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="button"
                onClick={() => {
                  if (newRequirement.trim()) {
                    setFormData((prev) => ({
                      ...prev,
                      requirements: [
                        ...prev.requirements,
                        newRequirement.trim(),
                      ],
                    }));
                    setNewRequirement("");
                  }
                }}
                className="bg-green-600 text-white px-3 py-2 rounded-md hover:bg-green-700 text-sm"
              >
                Add
              </button>
            </div>

            <div className="flex gap-2 flex-wrap">
              {formData.requirements.map((req, index) => (
                <div
                  key={index}
                  className="flex items-center bg-gray-100 px-2 py-1 rounded-full text-xs"
                >
                  <span>{req}</span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormData((prev) => ({
                        ...prev,
                        requirements: prev.requirements.filter(
                          (_, i) => i !== index
                        ),
                      }))
                    }
                    className="ml-2 text-red-500 hover:underline"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          </div>

          <div className="col-span-full flex justify-center">
            <button
              type="submit"
              className="bg-blue-600 text-white px-8 py-2 rounded-md hover:bg-blue-700 text-sm font-medium"
            >
              Post Job
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CreateJob;

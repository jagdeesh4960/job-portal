import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { applyToJob, uploadResume } from "../../features/jobs/jobThunks.js";
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import { AiOutlineLoading3Quarters, AiOutlineCloudUpload, AiOutlineCheckCircle, AiOutlineCloseCircle } from "react-icons/ai";

const ApplicationForm = () => {
  const { jobId } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const job = useSelector((state) =>
    state.jobs.jobs.find((j) => j._id.toString() === jobId.toString())
  );
  const user = useSelector((state) => state.auth.user);

  const [loadingCover, setLoadingCover] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [resumeUrl, setResumeUrl] = useState("");
  const [uploadStatus, setUploadStatus] = useState(null); // null | success | error

  const [form, setForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
    countryCode: "+91", // default India
    phone: "",
    linkedin: "",
    github: "",
    portfolio: "",
    coverLetter: "",
    resume: null,
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleResumeChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    setUploadStatus(null);
    try {
      const url = await dispatch(uploadResume(file)).unwrap();
      setResumeUrl(url);
      setUploadStatus("success");
    } catch (err) {
      setUploadStatus("error");
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resumeUrl) return alert("Please upload your resume first!");

    const payload = {
      jobId,
      ...form,
      phone: form.phone,
      resume: resumeUrl,
    };


    dispatch(applyToJob(payload));
    setMessage("Application submitted!");
    navigate("/candidate/applied-jobs");
  };

  if (!job)
    return <div className="text-center mt-10 text-red-600">Job not found.</div>;

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 rounded-2xl shadow-xl bg-white">
      <h2 className="text-3xl font-bold text-blue-700 mb-6">
        Apply for <span className="text-gray-900">{job.title}</span>
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Info */}
        <div className="space-y-2">
          <input name="name" value={form.name} onChange={handleChange} type="text" placeholder="Full Name" required className="w-full bg-gray-100 px-4 py-3 rounded-lg" />
          <input name="email" value={form.email} onChange={handleChange} type="email" placeholder="Email Address" required className="w-full bg-gray-100 px-4 py-3 rounded-lg" />
          <div className="flex gap-2">
           
            <PhoneInput
              country={'in'}
              value={String(form.phone || '').replace('+', '')}
              onChange={(phone) => setForm((prev) => ({ ...prev, phone: `+${phone}` }))}
              inputProps={{
                name: 'phone',
                required: true,
              }}
              inputClass="!w-full !border-none !bg-gray-100 !rounded-lg !px-4 !py-3"
              containerClass="!bg-transparent"
            />


          </div>
        </div>

        {/* Optional Links */}
        <div className="space-y-2">
          <input name="linkedin" value={form.linkedin} onChange={handleChange} type="url" placeholder="LinkedIn Profile (optional)" className="w-full bg-gray-100 px-4 py-3 rounded-lg" />
          <input name="github" value={form.github} onChange={handleChange} type="url" placeholder="GitHub Profile (optional)" className="w-full bg-gray-100 px-4 py-3 rounded-lg" />
          <input name="portfolio" value={form.portfolio} onChange={handleChange} type="url" placeholder="Portfolio URL (optional)" className="w-full bg-gray-100 px-4 py-3 rounded-lg" />
        </div>

        {/* Cover Letter */}
        <div className="space-y-2">
          <textarea name="coverLetter" value={form.coverLetter} onChange={handleChange} rows={5} placeholder="Write a brief cover letter or message..." className="w-full bg-gray-100 px-4 py-3 rounded-lg"></textarea>
        </div>

        {/* Resume Upload */}
        <div className="space-y-2">
          <label className="text-gray-600 text-sm font-medium flex items-center gap-2">
            <AiOutlineCloudUpload className="text-xl" />
            Upload Resume (PDF or DOC)
          </label>
          <input type="file" accept=".pdf,.doc,.docx" onChange={handleResumeChange} required disabled={uploading} className="w-full" />

          <div className="flex items-center gap-2 mt-1">
            {uploading && (
              <span className="text-blue-500 flex items-center gap-1">
                <AiOutlineLoading3Quarters className="animate-spin" /> Uploading...
              </span>
            )}
            {uploadStatus === "success" && (
              <span className="text-green-600 flex items-center gap-1">
                <AiOutlineCheckCircle /> Resume uploaded!
              </span>
            )}
            {uploadStatus === "error" && (
              <span className="text-red-500 flex items-center gap-1">
                <AiOutlineCloseCircle /> Upload failed. Try again.
              </span>
            )}
          </div>
        </div>

        <button
          type="submit"
          disabled={!resumeUrl || uploading}
          className={`w-full font-semibold py-3 rounded-lg text-white ${!resumeUrl || uploading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
            }`}
        >
          Submit Application
        </button>
      </form>

      {message && (
        <p className="mt-4 text-center text-green-600 font-medium">{message}</p>
      )}
    </div>
  );
};

export default ApplicationForm;

import Job from "../models/jobModel.js";
import appliedJobs from "../models/appliedJobsModel.js";
import SavedJobs from "../models/savedJobsModel.js";
import Applications from "../models/applicationModel.js";
import appliedJob from "../models/appliedJobsModel.js";
import { uploadResumeToCloud } from "../services/cloudService.js";
import { sendEmail } from "../services/sendEmail.js";
import userModel from "../models/userModel.js";





export const saveToJob = async (req, res, next) => {
  try {
    const { jobId } = req.params;
    const userId = req.user._id;

    const alreadySaved = await SavedJobs.findOne({ job: jobId, user: userId });
    if (alreadySaved) {
      return res.status(400).json({ message: "Job already saved" });
    }

    const newSavedJob = await SavedJobs.create({
      job: jobId,
      user: userId,
    });

    const populatedSavedJob = await newSavedJob.populate([
      { path: "user" },
      { path: "job" },
    ]);

    res.status(201).json(populatedSavedJob);
  } catch (error) {
    next(error);
  }
};

export const removeSaveJob = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { jobId } = req.params;

    const deleted = await SavedJobs.findOneAndDelete({
      user: userId,
      job: jobId,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Saved job not found" });
    }

    res.status(200).json(deleted);
  } catch (error) {
    next(error);
  }
};

export const getAppliedJobs = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const appliedJob = await appliedJobs
      .find({ applicant: userId })
      .populate("job")
      .populate("applicant");
    res.status(200).json(appliedJob);
  } catch (error) {
    next(error);
  }
};

export const getAllJobs = async (req, res, next) => {
  try {
    const allJobs = await Job.find();
    if (!allJobs) {
      res.status(500).json({ message: "jobs not found." });
    }
    res.status(200).json(allJobs);
  } catch (error) {
    next(error);
  }
};

export const uploadResume = async (req, res) => {
  try {
    const mediaFile = req.file;
    if (!mediaFile) {
      return res.status(400).json({ msg: "Resume is required" });
    }
    const resumeBuffer = mediaFile.buffer;
    const resume = await uploadResumeToCloud(resumeBuffer, "raw", mediaFile.originalname);

    return res.status(200).json(resume.url);

  } catch (err) {
    console.error("Error uploading resume:", err);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const applyToJob = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { jobId } = req.body;

    const alreadyApplied = await appliedJob.findOne({
      job: jobId,
      applicant: userId,
    });

    if (alreadyApplied) {
      return res.status(400).json({ message: "You have already applied to this job." });
    }

    const formData = {
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone,
      linkedin: req.body.linkedin,
      github: req.body.github,
      portfolio: req.body.portfolio,
      coverLetter: req.body.coverLetter,
      resumeUrl: req.body.resume,
    };

    const application = await Applications.create({
      job: jobId,
      applicant: userId,
      formDetails: formData,
    });

    await appliedJobs.create({
      job: jobId,
      applicant: userId,
      formDetails: formData,
    });

    // Populate job and employer details
    await application.populate({
      path: "job",
      populate: {
        path: "authorId",
        model: "User",
      },
    });

    // Send mail to applicant
    const { email, name } = formData;
    await sendEmail({
      to: email,
      subject: `Application Submitted for Job: ${application.job.title}`,
      text: `Hi ${name},\n\nYour application for the job has been successfully submitted.\n\nThank you for applying!\n\nJob Portal Team`,
      html: `
        <h2>Hello ${name},</h2>
        <p>Your application for <strong>Job: ${application.job.title}</strong> has been submitted successfully.</p>
        <p>Thank you for using our portal.</p>
        <br/>
        <p>Best regards,<br/>Job Portal Team</p>
      `,
    });

    // Send mail to employer
    const employerEmail = application.job.authorId.email;
    const employerName = application.job.authorId.name;

    await sendEmail({
      to: employerEmail,
      subject: `New Application Received for Job: ${application.job.title}`,
      text: `Hi ${employerName},\n\nYou have received a new application for the job "${application.job.title}".\n\nThank you!`,
      html: `
        <h2>Hello ${employerName},</h2>
        <p>You have received a new application for the job <strong>${application.job.title}</strong>.</p>
        <p>Candidate Name: ${name}</p>
        <p>Email: ${email}</p>
        <br/>
        <p>Thank you for using our portal.<br/>- Job Portal Team</p>
      `,
    });

    res.status(201).json(application);
  } catch (error) {
    next(error);
  }
};


export const getSavedJobs = async (req, res, next) => {
  try {
    const userId = req.user._id;

    const savedJobs = await SavedJobs.find({ user: userId })
      .populate("job")
      .populate("user");

    res.status(200).json(savedJobs);
  } catch (error) {
    next(error);
  }
};

export const createJob = async (req, res, next) => {
  try {
    const {
      title,
      company,
      location,
      type,
      description,
      salary,
      deadline,
      requirements,
    } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      type,
      description,
      salary,
      deadline,
      authorId: req.user._id,
      requirements,
    });

    res.status(201).json(job);
  } catch (error) {
    next(error);
  }
};

export const deleteJob = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const { jobId } = req.params;

    const deletedJob = await Job.findOneAndDelete({
      _id: jobId,
      authorId: userId,
    });

    if (!deletedJob) {
      return res
        .status(404)
        .json({ message: "Job not found or you're not authorized" });
    }

    await SavedJobs.deleteMany({ job: jobId });
    await appliedJobs.deleteMany({ job: jobId });
    await Applications.deleteMany({ job: jobId });

    res.status(200).json(deletedJob);
  } catch (error) {
    next(error);
  }
};

export const editJob = async (req, res, next) => {
  try {
    const { formData, jobId } = req.body;

    const updatedJob = await Job.findByIdAndUpdate(
      jobId,
      {
        ...formData,
        authorId: req.user._id,
      },
      { new: true }
    );

    if (!updatedJob) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.status(200).json(updatedJob);
  } catch (error) {
    next(error);
  }
};

export const userPostedJobs = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const userPostedJobs = await Job.find({
      authorId: userId,
    });

    res.status(200).json(userPostedJobs);
  } catch (error) {
    next(error);
  }
};

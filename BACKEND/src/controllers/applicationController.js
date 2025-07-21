import Job from "../models/jobModel.js";
import Applications from "../models/applicationModel.js";
import appliedJob from "../models/appliedJobsModel.js";
import { sendEmail } from "../services/sendEmail.js";
import { sendWhatsAppMessage } from "../services/sendWhatsApp.js";
import userModel from "../models/userModel.js";



export const cancelApplication = async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const application = await appliedJob.findOneAndDelete({
      job: jobId,
      applicant: req.user._id,
    });

    await Applications.findOneAndDelete({
      job: jobId,
      applicant: req.user._id,
    });

    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const applicant = await userModel.findById(req.user._id);
    if (!applicant) {
      return res.status(404).json({ message: "Applicant not found" });  
    }
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    } 
    const employer = await userModel.findById(job.authorId);
    if (!employer) {
      return res.status(404).json({ message: "Employer not found" });
    }
    await sendEmail({
      to: employer.email,
      subject: `Application Cancelled for "${job.title}"`,
      text: `The applicant ${applicant.name} has cancelled their application for the job "${job.title}".`,
      html: `
        <h2>Application Cancelled</h2>
        <p>The applicant <strong>${applicant.name}</strong> has cancelled their application for the job <strong>${job.title}</strong>.</p>
        <p>Thank you for using our portal.</p>
      `,
    });

  
    res.status(200).json(application);
  } catch (error) {
    next(error);
  }
};

export const getApplications = async (req, res, next) => {
  try {
    const employerId = req.user._id;

    const employerJobs = await Job.find({ authorId: employerId }).select("_id");

    const jobIds = employerJobs.map((job) => job._id);

    const applications = await Applications.find({ job: { $in: jobIds } })
      .populate("job")
      .populate("applicant");

    res.status(200).json(applications);
  } catch (error) {
    next(error);
  }
};

export const deleteApplicaton = async (req, res, next) => {
  try {
    const { jobId, applicantId } = req.body;

    const application = await appliedJob.findOneAndDelete({
      job: jobId,
      applicant: applicantId,
    });

    if (!(application)) {
      return res.status(404).json({ message: "Application not found" });
    }


    await Applications.findOneAndDelete({
      job: jobId,
      applicant: applicantId,
    });



    res.status(200).json(application);
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req, res, next) => {
  try {
    const { applicationId, status } = req.body;

    const application = await Applications.findById(applicationId);
    if (!application)
      return res.status(404).json({ message: "Application not found" });

    application.status = status;
    await application.save();

    const job = await appliedJob.findOne({
      job: application.job,
      applicant: application.applicant,
    });
    if (job) {
      job.status = status;
      await job.save();
    }

    const populatedApplication = await application.populate([
      { path: "job" },
      { path: "applicant" },
    ]);

    // ✅ Send email to candidate
    const candidateEmail = populatedApplication.formDetails.email;
    const candidateName = populatedApplication.formDetails.name;
    const jobTitle = populatedApplication.job.title;

    await sendEmail({
      to: candidateEmail,
      subject: `Your Application Status for "${jobTitle}" Updated`,
      text: `Hi ${candidateName},\n\nYour application status for "${jobTitle}" has been updated to "${status.toUpperCase()}".\n\nThank you for applying.\n\n- Job Portal Team`,
      html: `
        <h2>Hello ${candidateName},</h2>
        <p>Your application status for <strong>${jobTitle}</strong> has been updated.</p>
        <p><strong>New Status:</strong> ${status.toUpperCase()}</p>
        <br/>
        <p>Thank you for using our portal.<br/>- Job Portal Team</p>
      `,
    });

    const lowerStatus = status.toLowerCase();
    if (lowerStatus === "accepted" || lowerStatus === "shortlisted") {
      const candidatePhone = populatedApplication.formDetails.phone; 
      console.log("📞 Candidate phone number:", candidatePhone);
      
      if (candidatePhone) {
        await sendWhatsAppMessage(candidatePhone, candidateName, jobTitle);
      } else {
        console.warn("❗ Candidate phone number not available");
      }
    }

    res.status(200).json(populatedApplication);
  } catch (error) {
    next(error);
  }
};





















import mongoose from "mongoose";

const applicationsJobSchema = new mongoose.Schema(
  {
    job: { type: mongoose.Schema.Types.ObjectId, ref: "Job", required: true },
    formDetails: {
      type: Object,
      required: true,
    },
    applicant:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    },
    status: {
      type: String,
      enum: ["Applied", "Shortlisted", "Accepted", "Rejected"],
      default: "Applied",
    },
  },
  {
    timestamps: true,
  }
);

const Applications = mongoose.model("Application", applicationsJobSchema);
export default Applications;

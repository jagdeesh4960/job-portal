import { createSlice } from "@reduxjs/toolkit";
import {
  applyToJob,
  fetchAllJobs,
  createJob,
  deleteJob,
  editJob,
  getSavedJobs,
  removeSaveJob,
  getAppliedJobs,
  saveToJob,
  fetchUserJobs
} from "./jobThunks.js";

const initialState = {
  jobs: [],
  savedJobs: [],
  appliedJobs: [],
  userPostedJobs: [],
  searchTerm: "",
  jobTypeFilter: "All",
  loading: false,
  error: null,
};

const jobsSlice = createSlice({
  name: "jobs",
  initialState,
  reducers: {
    removeJobInstantly: (state, action) => {
      state.jobs = state.jobs.filter((job) => job._id !== action.payload);
    },
    saveJobInstantly: (state, action) => {
      state.savedJobs.push(action.payload);
    },
    unsaveJobInstantly: (state, action) => {
      state.savedJobs = state.savedJobs.filter(
        (job) => job._id !== action.payload
      );
    },
    setSearchTerm: (state, action) => {
      state.searchTerm = action.payload;
    },
    setJobTypeFilter: (state, action) => {
      state.jobTypeFilter = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllJobs.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.jobs = action.payload;
      })
      .addCase(fetchAllJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // createJob
      .addCase(createJob.fulfilled, (state, action) => {
        state.jobs.push(action.payload);
      })

      // deleteJob
      .addCase(deleteJob.fulfilled, (state, action) => {
        state.jobs = state.jobs.filter(
          (job) => job._id !== action.payload._id
        );
        state.userPostedJobs=state.userPostedJobs.filter(
          (job)=>job._id !==action.payload._id
        )
      })

      // editJob
      .addCase(editJob.fulfilled, (state, action) => {
        const index = state.jobs.findIndex(
          (job) => job._id === action.payload._id
        );
        if (index !== -1) {
          state.jobs[index] = action.payload;
        }
      })

      // applyToJob
      .addCase(applyToJob.fulfilled, (state, action) => {
        state.appliedJobs.push(action.payload);
      })

      // getSavedJobs
      .addCase(getSavedJobs.fulfilled, (state, action) => {
        state.savedJobs = action.payload;
      })

      // saveToJob
      .addCase(saveToJob.fulfilled, (state, action) => {
        state.savedJobs.push(action.payload);
      })

      // removeSaveJob
      .addCase(removeSaveJob.fulfilled, (state, action) => {
        state.savedJobs = state.savedJobs.filter(
          (job) => job._id !== action.payload._id
        );
      })

      // getAppliedJobs
      .addCase(getAppliedJobs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAppliedJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.appliedJobs = action.payload;
      })
      .addCase(getAppliedJobs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(fetchUserJobs.fulfilled, (state, action) => {
        state.loading = false;
        state.userPostedJobs = action.payload;
      })
      
  },
});

export const { removeJobInstantly, saveJobInstantly, unsaveJobInstantly,setJobTypeFilter,setSearchTerm } =
  jobsSlice.actions;

export default jobsSlice.reducer;

import { createSlice } from '@reduxjs/toolkit';
import {
  fetchAllApplications,
  deleteApplicaton,
  updateStatus,
  cancelApplication,
} from './applicationThunks.js';

const initialState = {
  applications: [],
  loading: {
    fetch: false,
    delete: false,
    update: false,
    cancel: false,
  },
  error: null,
};

const applicationSlice = createSlice({
  name: 'applications',
  initialState,
  reducers: {},

  extraReducers: (builder) => {
    builder

      // 🔄 FETCH ALL APPLICATIONS
      .addCase(fetchAllApplications.pending, (state) => {
        state.loading.fetch = true;
        state.error = null;
      })
      .addCase(fetchAllApplications.fulfilled, (state, action) => {
        state.loading.fetch = false;
        state.applications = action.payload;
      })
      .addCase(fetchAllApplications.rejected, (state, action) => {
        state.loading.fetch = false;
        state.error = action.payload;
      })

      // 🗑️ DELETE APPLICATION
      .addCase(deleteApplicaton.pending, (state) => {
        state.loading.delete = true;
        state.error = null;
      })
      .addCase(deleteApplicaton.fulfilled, (state, action) => {
        state.loading.delete = false;
        const { jobId, applicantId } = action.meta.arg;
        state.applications = state.applications.filter(
          (app) => !(app.jobId === jobId && app.applicantId === applicantId)
        );
      })
      .addCase(deleteApplicaton.rejected, (state, action) => {
        state.loading.delete = false;
        state.error = action.payload;
      })

      // ✏️ UPDATE STATUS
      .addCase(updateStatus.pending, (state) => {
        state.loading.update = true;
        state.error = null;
      })
      .addCase(updateStatus.fulfilled, (state, action) => {
        state.loading.update = false;
        const { applicationId, status } = action.meta.arg;
        const target = state.applications.find(app => app._id === applicationId);
        if (target) {
          target.status = status;
        }
      })
      .addCase(updateStatus.rejected, (state, action) => {
        state.loading.update = false;
        state.error = action.payload;
      })

      // ❌ CANCEL APPLICATION
      .addCase(cancelApplication.pending, (state) => {
        state.loading.cancel = true;
        state.error = null;
      })
      .addCase(cancelApplication.fulfilled, (state, action) => {
        state.loading.cancel = false;
        const { jobId } = action.meta.arg;
        state.applications = state.applications.filter(
          (app) => app.jobId !== jobId
        );
      })
      .addCase(cancelApplication.rejected, (state, action) => {
        state.loading.cancel = false;
        state.error = action.payload;
      });
  },
});

export default applicationSlice.reducer;

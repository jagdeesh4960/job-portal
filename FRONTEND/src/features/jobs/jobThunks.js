import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/api.js';



export const applyToJob = createAsyncThunk("job/applyToJob", async (formData, thunkAPI) => {
  try {
    const res = await API.post("/job/applyTojob", formData, {
       withCredentials: true,
    });
    return res.data;
  } catch (err) {
    return thunkAPI.rejectWithValue(err.response.data.message);
  }
});

export const uploadResume = createAsyncThunk("upload/resume", async (file, { rejectWithValue }) => {
  try {
    const formData = new FormData();
    formData.append("resume", file);

    const res = await API.post("/job/upload-resume", formData, {
      withCredentials: true,
    });

    return res.data;
  } catch (err) {
    return rejectWithValue(err.response.data.message || "Upload resume failed");
  }
});


export const fetchAllJobs = createAsyncThunk(
  '/job/get-jobs',
  async (thunkAPI) => {
    try {
      const response=await API.get('/job/get-jobs');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch jobs');
    }
  }
);

export const fetchUserJobs = createAsyncThunk(
  '/job/fetchUserJobs',
  async (thunkAPI) => {
    try {
      const response=await API.get('/job/get-userJob');
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch jobs');
    }
  }
);

export const createJob = createAsyncThunk(
  '/job/create-job',
  async (jobData, thunkAPI) => {
    try {
      const response=await API.post('/job/create-job',jobData)
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to create job');
    }
  }
);

export const deleteJob = createAsyncThunk(
  'jobs/deleteJob',
  async (jobId, thunkAPI) => {
    try {
      const response=await API.get(`/job/delete-job/${jobId}`);
      return response.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to delete job');
    }
  }
);

export const editJob = createAsyncThunk(
  'jobs/editJob',
  async ({formData,jobId}, thunkAPI) => {
    try {
      const response=await API.post('/job/edit-job',{formData,jobId});
      return response.data; 
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to delete job');
    }
  }
);

export const getSavedJobs = createAsyncThunk('jobs/getSavedJobs', async (thunkAPI) => {
  try { 
    const response = await API.get('/job/get-saved-jobs');
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Job save failed');
  }
});

export const removeSaveJob = createAsyncThunk('job/removeSaveJob', async (jobId, thunkAPI) => {
  try { 
    const response = await API.delete(`/job/removeSaveJob/${jobId}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Job remove failed');
  }
});

export const getAppliedJobs = createAsyncThunk('job/get-applied-jobs', async ( thunkAPI) => {
  try { 
    const response = await API.get('/job/get-applied-jobs');
    return response.data;
  } catch (error) { 
    return thunkAPI.rejectWithValue(error.response.data.message || 'fetch applid job failed');
  }
});


export const saveToJob = createAsyncThunk('job/saveToJob', async (jobId, thunkAPI) => {
  try { 
    const response = await API.get(`/job/saveToJob/${jobId}`);
    return response.data;
  } catch (error) {
    return thunkAPI.rejectWithValue(error.response.data.message || 'Job save failed');
  }
});

  

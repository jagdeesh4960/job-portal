import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/api.js';



export const fetchAllApplications = createAsyncThunk(
  'applications/fetchAllApplications',
  async ( thunkAPI) => {
    try {
      const response=await API.get('/application/get-applications')
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch applications');
    }
  }
);


export const deleteApplicaton = createAsyncThunk(
  'applications/deleteApplicaton',
  async ({jobId, applicantId}, thunkAPI) => {
    try {
      const response=await API.post('/application/delete-applicaton',{jobId, applicantId})
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to fetch applications');
    }
  }
);


export const updateStatus = createAsyncThunk(
  'applications/updateStatus',
  async ({ applicationId,status}, thunkAPI) => {
    try {
      const response=await API.post('/application/update-status',{ applicationId,status})
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to update status');
    }
  }
);


export const cancelApplication = createAsyncThunk(
  'applications/cancelApplication',
  async (jobId, thunkAPI) => {
    try {
      const response=await API.get(`/application/cancel-application/${jobId}`)
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue('Failed to cancel application');
    }
  }
);


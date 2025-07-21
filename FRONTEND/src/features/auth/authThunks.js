import { createAsyncThunk } from '@reduxjs/toolkit';
import API from '../../api/api';

// LOGIN user (already exists)
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (formData, thunkAPI) => {
    try {
      const response = await API.post('/auth/login', formData)
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Login failed');
    }
  }
);


export const logOutUser = createAsyncThunk(
  'auth/logOutUser',
  async (thunkAPI) => {
    try {
      const response = await API.get('/auth/logOutUser')
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Logout failed');
    }
  }
);


// ✅ REGISTER user
export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (formData, thunkAPI) => {
    try {
      const response = await API.post('/auth/register', formData);
      return response.data;

    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Registration failed');
    }
  }
);


export const getCurrentUser = createAsyncThunk(
  'user/get-profile',
  async (thunkAPI) => {
    try {
      const response = await API.get('/user/get-profile');
      return response.data;

    } catch (error) {
      return thunkAPI.rejectWithValue(error.response?.data || 'Registration failed');
    }
  }
);


export const updateProfile = createAsyncThunk(
  'auth/updateProfile',
  async (userData, thunkAPI) => {
    try {
      const response = await API.post('/auth/update-Profile', userData);
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Profile updation failed'
      );
    }
  }
);

// export const updatePassword = createAsyncThunk(
//   'auth/updatePassword',
//   async (passwordData, thunkAPI) => {
//     try {
//       const response = await API.post('/auth/update-password', passwordData);
//       return response.data;
//     } catch (error) {
//       return thunkAPI.rejectWithValue(
//         error.response?.data?.message || 'Password update failed'
//       );
//     }
//   }
// );

export const updateProfileImage = createAsyncThunk(
  'auth/updateProfilePicture',

  async (formData, thunkAPI) => {

    try {
      const response = await API.post('/auth/update-profile-picture', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data || null;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Profile picture update failed'
      );
    }
  }
);

export const forgotPassword = createAsyncThunk(
  'auth/forgotPassword',
  async (email, thunkAPI) => {
    try {
      const response = await API.post('/auth/forgot-password', { email });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Forgot password failed'
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  'auth/resetPassword',
  async ({ token, password }, thunkAPI) => {  
    try {
      const response = await API.post(`/auth/reset-password/${token}`, { newPassword: password });
      return response.data;
    } catch (error) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || 'Reset password failed'
      );
    }
  }   
);
 
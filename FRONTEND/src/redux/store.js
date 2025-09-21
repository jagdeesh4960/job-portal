import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/AuthSlice.js';
import jobsReducer from '../features/jobs/JobSlice.js';
import applicationReducer from '../features/applications/ApplicationSlice.js';

import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage'; // defaults to localStorage

const persistConfig = {
  key: 'root',
  storage,
  whitelist: ['auth'], // only persist auth reducer
};

const rootReducer = combineReducers({
  auth: authReducer,
  jobs: jobsReducer,
  applications: applicationReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({ serializableCheck: false }),
});

export const persistor = persistStore(store);
export default store;

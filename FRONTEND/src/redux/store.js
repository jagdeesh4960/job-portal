import { configureStore, combineReducers } from '@reduxjs/toolkit';
import authReducer from '../features/auth/AuthSlice';
import jobsReducer from '../features/jobs/JobSlice';
import applicationReducer from '../features/applications/ApplicationSlice';

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

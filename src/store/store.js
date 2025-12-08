import { configureStore } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import projectsReducer from './slices/projectsSlice';
import documentsReducer from './slices/documentSlice';
import usersReducer from './slices/userSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    projects: projectsReducer,
    documents: documentsReducer,
    users: usersReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export default store;


import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../api/axios'; 

const API_URL = '/api/projects'; 

// Fetch all projects (admin only)
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get(`${API_URL}/all`);
      return response.data.data || response.data; // Adjust for your API response wrapper
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
    }
  }
);

// Create a new project (admin only)
export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const csrfResponse = await api.get('/csrf-token');
      const csrfToken = csrfResponse.data.csrfToken;

      const response = await api.post(API_URL, projectData, {
        headers: { 'csrf-token': csrfToken }
      });
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create project');
    }
  }
);

// Assign user to a project
export const assignProjectToUser = createAsyncThunk(
  'projects/assignProjectToUser',
  async ({ projectId, userId }, { rejectWithValue }) => {
    try {
      const csrfResponse = await api.get('/csrf-token');
      const csrfToken = csrfResponse.data.csrfToken;

      const response = await api.post(
        `${API_URL}/${projectId}/assign-user`,
        { userId },
        { headers: { 'csrf-token': csrfToken } }
      );
      return response.data.project || response.data; // Adjust based on your backend response structure
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign project');
    }
  }
);

// Fetch all users (to populate managers and members)
export const fetchUsers = createAsyncThunk(
  'projects/fetchUsers',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/api/users'); // Full API endpoint for safety
      return response.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

const initialState = {
  projects: [],
  users: [],
  loading: false,
  error: null,
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Projects
      .addCase(fetchProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create Project
      .addCase(createProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects.push(action.payload);
      })
      .addCase(createProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Assign User to Project
      .addCase(assignProjectToUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignProjectToUser.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProject = action.payload;
        const idx = state.projects.findIndex(p => p._id === updatedProject._id);
        if (idx !== -1) {
          state.projects[idx] = updatedProject;
        }
      })
      .addCase(assignProjectToUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Users
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError } = projectsSlice.actions;
export default projectsSlice.reducer;

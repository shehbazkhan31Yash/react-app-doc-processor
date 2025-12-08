
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { projectService, userService } from '../../api/services';

// Fetch all projects (admin only)
export const fetchProjects = createAsyncThunk(
  'projects/fetchProjects',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await projectService.getAllProjects(params);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch projects');
    }
  }
);

// Fetch manager projects (manager only)
export const fetchManagerProjects = createAsyncThunk(
  'projects/fetchManagerProjects',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await projectService.getManagerProjects(params);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch manager projects');
    }
  }
);

// Fetch user projects (user only)
export const fetchUserProjects = createAsyncThunk(
  'projects/fetchUserProjects',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await projectService.getUserProjects(params);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch user projects');
    }
  }
);

// Create a new project (admin only)
export const createProject = createAsyncThunk(
  'projects/createProject',
  async (projectData, { rejectWithValue }) => {
    try {
      const response = await projectService.createProject(projectData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create project');
    }
  }
);

// Update project
export const updateProject = createAsyncThunk(
  'projects/updateProject',
  async ({ id, projectData }, { rejectWithValue }) => {
    try {
      const response = await projectService.updateProject(id, projectData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update project');
    }
  }
);

// Delete project
export const deleteProject = createAsyncThunk(
  'projects/deleteProject',
  async (id, { rejectWithValue }) => {
    try {
      await projectService.deleteProject(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete project');
    }
  }
);

// Assign user to a project
export const assignProjectToUser = createAsyncThunk(
  'projects/assignProjectToUser',
  async ({ projectId, userId }, { rejectWithValue }) => {
    try {
      const response = await projectService.assignUserToProject(projectId, userId);
      return response.project || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to assign project');
    }
  }
);

// Fetch all users (to populate managers and members)
export const fetchUsers = createAsyncThunk(
  'projects/fetchUsers',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await userService.getAllUsers(params);
      return response.data || response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

const initialState = {
  projects: [],
  users: [],
  meta: {
    total: 0,
    page: 1,
    limit: 20,
    pages: 1,
  },
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
      // Fetch Manager Projects
      .addCase(fetchManagerProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchManagerProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchManagerProjects.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch User Projects
      .addCase(fetchUserProjects.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProjects.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = action.payload;
      })
      .addCase(fetchUserProjects.rejected, (state, action) => {
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
      // Update Project
      .addCase(updateProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateProject.fulfilled, (state, action) => {
        state.loading = false;
        const updatedProject = action.payload;
        const idx = state.projects.findIndex(p => p._id === updatedProject._id);
        if (idx !== -1) {
          state.projects[idx] = updatedProject;
        }
      })
      .addCase(updateProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Project
      .addCase(deleteProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProject.fulfilled, (state, action) => {
        state.loading = false;
        state.projects = state.projects.filter(p => p._id !== action.payload);
      })
      .addCase(deleteProject.rejected, (state, action) => {
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

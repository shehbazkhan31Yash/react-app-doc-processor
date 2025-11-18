import { createSlice } from '@reduxjs/toolkit';

// Dummy data
const dummyProjects = [
  {
    id: 1,
    name: "Project Alpha",
    description: "Build authentication system",
    documentURL: "https://via.placeholder.com/1024x768?text=Project+Alpha+Doc",
    createdBy: 1,  // Admin ID
    assignedTo: []  // Array of User IDs
  },
  {
    id: 2,
    name: "Project Beta",
    description: "Dashboard redesign",
    documentURL: "https://via.placeholder.com/1024x768?text=Project+Beta+Doc",
    createdBy: 1,
    assignedTo: [3]  // Assigned to user with ID 3
  },
  {
    id: 3,
    name: "Project Gamma",
    description: "Database optimization",
    documentURL: "https://via.placeholder.com/1024x768?text=Project+Gamma+Doc",
    createdBy: 1,
    assignedTo: [3, 4]
  }
];

// Dummy users
const dummyUsers = [
  { id: 1, name: "Alice Admin", role: "admin", email: "admin@example.com", password: "admin123", userName: "alice_admin" },
  { id: 2, name: "Bob Manager", role: "manager", email: "manager@example.com", password: "manager123", userName: "bob_manager" },
  { id: 3, name: "Charlie User", role: "user", email: "user1@example.com", password: "user123", userName: "charlie_user" },
  { id: 4, name: "Diana User", role: "user", email: "user2@example.com", password: "user123", userName: "diana_user" }
];

const initialState = {
  projects: dummyProjects,
  users: dummyUsers,
  loading: false,
  error: null,
};

const projectsSlice = createSlice({
  name: 'projects',
  initialState,
  reducers: {
    // Create project (admin only)
    addProject(state, action) {
      const newProject = {
        id: Math.max(...state.projects.map(p => p.id), 0) + 1,
        ...action.payload,
        assignedTo: []
      };
      state.projects.push(newProject);
    },

    // Assign project to user (manager)
    assignProjectToUser(state, action) {
      const { projectId, userId } = action.payload;
      const project = state.projects.find(p => p.id === projectId);
      if (project && !project.assignedTo.includes(userId)) {
        project.assignedTo.push(userId);
      }
    },

    // Get user by ID
    getUserById(state, action) {
      return state.users.find(u => u.id === action.payload);
    }
  }
});

export const { addProject, assignProjectToUser } = projectsSlice.actions;
export default projectsSlice.reducer;

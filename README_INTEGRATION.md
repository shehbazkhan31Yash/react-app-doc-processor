# React Backend Integration Guide

## ✅ Complete API Integration Setup

Your React frontend is now fully integrated with your Node.js backend. Here's what has been implemented:

### 🔧 Core API Setup
- **Enhanced Axios Client** (`src/api/axios.js`)
  - JWT token management with encryption
  - Automatic CSRF token handling
  - Request/response interceptors
  - Error handling with auto-logout on 401

- **Complete API Services** (`src/api/services.js`)
  - Authentication (login/register)
  - User management (CRUD operations)
  - Project management (CRUD + user assignment)
  - Document management (upload, search, delete)

### 🏪 Redux Store Integration
- **Enhanced Auth Slice** (existing, already working)
- **Updated Projects Slice** (enhanced with full CRUD)
- **New Document Slice** (`src/store/slices/documentSlice.js`)
- **New User Slice** (`src/store/slices/userSlice.js`)
- **Updated Store** (includes all new slices)

### 🎣 Custom Hooks
- **useApi Hook** (`src/hooks/useApi.js`)
- **useFileUpload Hook** (for document uploads)

## 🚀 How to Use

### 1. Authentication
```javascript
import { useDispatch } from 'react-redux';
import { loginUser, registerUser } from '../store/slices/authSlice';

const dispatch = useDispatch();

// Login
dispatch(loginUser({ email, password }));

// Register
dispatch(registerUser({ userName, firstName, lastName, email, password, role }));
```

### 2. User Management
```javascript
import { useDispatch } from 'react-redux';
import { fetchAllUsers, updateUser, deleteUser } from '../store/slices/userSlice';

const dispatch = useDispatch();

// Fetch users with pagination
dispatch(fetchAllUsers({ page: 1, limit: 20 }));

// Update user
dispatch(updateUser({ id: userId, userData: { firstName: 'New Name' } }));

// Delete user
dispatch(deleteUser(userId));
```

### 3. Project Management
```javascript
import { useDispatch } from 'react-redux';
import { 
  fetchProjects, 
  createProject, 
  updateProject, 
  deleteProject,
  assignProjectToUser 
} from '../store/slices/projectsSlice';

const dispatch = useDispatch();

// Create project
dispatch(createProject({
  name: 'Project Name',
  projectManager: 'managerId',
  members: ['userId1', 'userId2'],
  startDate: '2024-01-01',
  endDate: '2024-12-31',
  status: 'active'
}));

// Assign user to project
dispatch(assignProjectToUser({ projectId, userId }));
```

### 4. Document Management
```javascript
import { useDispatch } from 'react-redux';
import { 
  createDocument, 
  fetchDocuments, 
  searchDocuments,
  fetchDocumentsByProject,
  deleteDocument 
} from '../store/slices/documentSlice';

const dispatch = useDispatch();

// Upload document
const formData = new FormData();
formData.append('projectSite', 'Site A');
formData.append('department', 'Engineering');
formData.append('equipment', 'Pump');
formData.append('projectId', 'projectId');
formData.append('attachments', file1);
formData.append('attachments', file2);

dispatch(createDocument(formData));

// Search documents
dispatch(searchDocuments({ query: 'search term', params: { page: 1 } }));
```

### 5. Direct API Calls (Alternative)
```javascript
import { authService, userService, projectService, documentService } from '../api/services';

// Direct service calls
const users = await userService.getAllUsers({ page: 1, limit: 20 });
const projects = await projectService.getAllProjects();
const documents = await documentService.searchDocuments('query');
```

## 🔐 Security Features
- **JWT Token Encryption**: Tokens stored encrypted in localStorage
- **CSRF Protection**: Automatic CSRF token handling for all protected routes
- **Role-based Access**: Built-in role checking in Redux state
- **Auto-logout**: Automatic logout on token expiration

## 📁 File Structure
```
src/
├── api/
│   ├── axios.js          # Enhanced axios client
│   └── services.js       # Complete API services
├── store/
│   ├── slices/
│   │   ├── authSlice.js      # Enhanced auth (existing)
│   │   ├── projectsSlice.js  # Enhanced projects
│   │   ├── documentSlice.js  # New document management
│   │   └── userSlice.js      # New user management
│   └── store.js          # Updated store config
└── hooks/
    └── useApi.js         # Custom API hooks
```

## 🌐 Environment Variables
Make sure your `.env` file has:
```
VITE_API_URL=http://localhost:8080
VITE_SECRET_KEY=your_encryption_key
```

## 🎯 Next Steps
1. Update your components to use the new Redux actions
2. Add error handling UI components
3. Implement file upload progress indicators
4. Add pagination components for lists
5. Create role-based route guards

Your backend integration is now complete and ready to use! 🎉
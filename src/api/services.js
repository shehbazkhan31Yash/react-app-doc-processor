import api from './axios';

// CSRF token management
let csrfToken = null;
const getCsrfToken = async () => {
  if (!csrfToken) {
    const response = await api.get('/csrf-token');
    csrfToken = response.data.csrfToken;
  }
  return csrfToken;
};

// Helper for CSRF-protected requests
const withCsrf = async (config = {}) => {
  const csrf = await getCsrfToken();
  return {
    ...config,
    headers: {
      ...config.headers,
      'x-csrf-token': csrf,
    },
  };
};

// Auth Services
export const authService = {
  register: async (userData) => {
    const config = await withCsrf();
    const response = await api.post('/users/register', userData, config);
    return response.data;
  },
  
  login: async (credentials) => {
    const response = await api.post('/users/login', credentials);
    return response.data;
  },
};

// User Services
export const userService = {
  getAllUsers: async (params = {}) => {
    const response = await api.get('/users/all', { params });
    return response.data;
  },
  
  getAllManagers: async (params = {}) => {
    const response = await api.get('/users/managers', { params });
    return response.data;
  },
  
  getAllEmployees: async (params = {}) => {
    const response = await api.get('/users/', { params });
    return response.data;
  },
  
  getUserById: async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },
  
  updateUser: async (id, userData) => {
    const config = await withCsrf();
    const response = await api.patch(`/users/${id}`, userData, config);
    return response.data;
  },
  
  deleteUser: async (id) => {
    const config = await withCsrf();
    const response = await api.delete(`/users/${id}`, config);
    return response.data;
  },
};

// Project Services
export const projectService = {
  createProject: async (projectData) => {
    const config = await withCsrf();
    const response = await api.post('/projects/', projectData, config);
    return response.data;
  },
  
  getAllProjects: async (params = {}) => {
    const response = await api.get('/projects/all', { params });
    return response.data;
  },
  
  getManagerProjects: async (params = {}) => {
    const response = await api.get('/projects/manager', { params });
    return response.data;
  },
  
  getUserProjects: async (params = {}) => {
    const response = await api.get('/projects/user', { params });
    return response.data;
  },
  
  updateProject: async (id, projectData) => {
    const config = await withCsrf();
    const response = await api.patch(`/projects/${id}`, projectData, config);
    return response.data;
  },
  
  deleteProject: async (id) => {
    const config = await withCsrf();
    const response = await api.delete(`/projects/${id}`, config);
    return response.data;
  },
  
  assignUserToProject: async (projectId, userId) => {
    const config = await withCsrf();
    const response = await api.post(`/projects/${projectId}/assign-user`, { userId }, config);
    return response.data;
  },
};

// Document Services
export const documentService = {
  createDocument: async (formData) => {
    const csrf = await getCsrfToken();
    const response = await api.post('/documents/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
        'x-csrf-token': csrf,
      },
    });
    return response.data;
  },
  
  getAllDocuments: async (params = {}) => {
    const response = await api.get('/documents/all', { params });
    return response.data;
  },
  
  searchDocuments: async (query, params = {}) => {
    const response = await api.get('/documents/search', { 
      params: { q: query, ...params } 
    });
    return response.data;
  },
  
  getDocumentsByProject: async (projectId, params = {}) => {
    const response = await api.get(`/documents/project/${projectId}`, { params });
    return response.data;
  },
  
  getDocumentAttachments: async (id) => {
    const response = await api.get(`/documents/${id}`);
    return response.data;
  },
  
  viewAttachment: async (docId, attachmentId) => {
    const response = await api.get(`/documents/${docId}/${attachmentId}`, {
      responseType: 'blob',
    });
    return response.data;
  },
  
  deleteDocument: async (id) => {
    const config = await withCsrf();
    const response = await api.delete(`/documents/${id}`, config);
    return response.data;
  },
  
  deleteAttachment: async (docId, attachmentId) => {
    const config = await withCsrf();
    const response = await api.delete(`/documents/${docId}/${attachmentId}`, config);
    return response.data;
  },
};
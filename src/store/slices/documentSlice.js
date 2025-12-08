import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { documentService } from '../../api/services';

// Async thunks
export const createDocument = createAsyncThunk(
  'documents/create',
  async (formData, { rejectWithValue }) => {
    try {
      const response = await documentService.createDocument(formData);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchDocuments = createAsyncThunk(
  'documents/fetchAll',
  async (params = {}, { rejectWithValue }) => {
    try {
      const response = await documentService.getAllDocuments(params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const searchDocuments = createAsyncThunk(
  'documents/search',
  async ({ query, params = {} }, { rejectWithValue }) => {
    try {
      const response = await documentService.searchDocuments(query, params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const fetchDocumentsByProject = createAsyncThunk(
  'documents/fetchByProject',
  async ({ projectId, params = {} }, { rejectWithValue }) => {
    try {
      const response = await documentService.getDocumentsByProject(projectId, params);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

export const deleteDocument = createAsyncThunk(
  'documents/delete',
  async (id, { rejectWithValue }) => {
    try {
      await documentService.deleteDocument(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || error.message);
    }
  }
);

const initialState = {
  documents: [],
  meta: {
    total: 0,
    page: 1,
    limit: 20,
    pages: 1,
  },
  loading: false,
  error: null,
  searchResults: [],
  searchMeta: {},
  searchLoading: false,
};

const documentSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearSearchResults: (state) => {
      state.searchResults = [];
      state.searchMeta = {};
    },
  },
  extraReducers: (builder) => {
    // Create document
    builder
      .addCase(createDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.documents.unshift(action.payload.document);
      })
      .addCase(createDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Fetch documents
    builder
      .addCase(fetchDocuments.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocuments.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload.documents;
        state.meta = action.payload.meta;
      })
      .addCase(fetchDocuments.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Search documents
    builder
      .addCase(searchDocuments.pending, (state) => {
        state.searchLoading = true;
        state.error = null;
      })
      .addCase(searchDocuments.fulfilled, (state, action) => {
        state.searchLoading = false;
        state.searchResults = action.payload.documents;
        state.searchMeta = action.payload.meta;
      })
      .addCase(searchDocuments.rejected, (state, action) => {
        state.searchLoading = false;
        state.error = action.payload;
      });

    // Fetch documents by project
    builder
      .addCase(fetchDocumentsByProject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDocumentsByProject.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = action.payload.documents;
        state.meta = action.payload.meta;
      })
      .addCase(fetchDocumentsByProject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });

    // Delete document
    builder
      .addCase(deleteDocument.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDocument.fulfilled, (state, action) => {
        state.loading = false;
        state.documents = state.documents.filter(doc => doc._id !== action.payload);
      })
      .addCase(deleteDocument.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, clearSearchResults } = documentSlice.actions;
export default documentSlice.reducer;
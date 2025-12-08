import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createProject, fetchUsers } from '../../store/slices/projectsSlice';
import { MdArrowBack, MdSave } from 'react-icons/md';

export default function CreateProject() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { users, loading, error } = useAppSelector((state) => state.projects);

  const [formData, setFormData] = useState({
    name: '',
    projectManager: '',
    members: [],
    startDate: '',
    endDate: '',
    description: '',
    status: 'planning'
  });

  // Fetch users when component mounts
  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMembersChange = (e) => {
    const selectedOptions = Array.from(e.target.selectedOptions, option => option.value);
    setFormData(prev => ({ ...prev, members: selectedOptions }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate dates
    if (new Date(formData.startDate) > new Date(formData.endDate)) {
      alert('Start date must be before end date');
      return;
    }

    if (formData.name.trim() && formData.description.trim()) {
      const result = await dispatch(createProject(formData));
      
      if (result.type === 'projects/createProject/fulfilled') {
        // Success - navigate back to admin dashboard
        navigate('/admin');
      }
    }
  };

  const handleCancel = () => {
    navigate('/admin');
  };

  return (

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-sky-900 p-6">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 -top-24 w-96 h-96 rounded-full bg-gradient-to-tr from-violet-700/30 to-cyan-700/20 blur-3xl transform rotate-12" />
          <div className="absolute right-0 bottom-0 w-80 h-80 rounded-2xl bg-gradient-to-bl from-rose-800/20 to-yellow-700/10 blur-2xl" />
        </div>

        <div className="relative max-w-4xl mx-auto">
          {/* Header with Back Button */}
          <div className="mb-8 flex items-center gap-4">
            <button
              onClick={handleCancel}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-100 hover:bg-slate-700/60 transition"
            >
              <MdArrowBack className="w-5 h-5" />
              Back
            </button>
            <div>
              <h1 className="text-4xl font-extrabold text-white tracking-tight">Create New Project</h1>
              <p className="text-slate-300 mt-2">Fill in the project details below</p>
            </div>
          </div>

          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-300">
              {error}
            </div>
          )}

          {/* Form Card */}
          <div className="bg-slate-900/60 border border-slate-800/60 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Project Name <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  name="name"
                  placeholder="Enter project name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-40 transition"
                  required
                />
              </div>

              {/* Project Manager */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Project Manager <span className="text-rose-400">*</span>
                </label>
                <select
                  name="projectManager"
                  value={formData.projectManager}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-40 transition"
                  required
                >
                  <option value="">Select Manager</option>
                  {Array.isArray(users) && users.filter(u => u.role === 'manager').map(user => (
                    <option key={user._id || user.id} value={user._id || user.id}>
                      {user.name || `${user.firstName} ${user.lastName}`}
                    </option>
                  ))}
                </select>
              </div>

              {/* Team Members */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Team Members
                </label>
                <select
                  name="members"
                  multiple
                  value={formData.members}
                  onChange={handleMembersChange}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-40 transition"
                  style={{ minHeight: '120px' }}
                >
                  {Array.isArray(users) && users.filter(u => u.role === 'user').map(user => (
                    <option key={user._id || user.id} value={user._id || user.id}>
                      {user.name || `${user.firstName} ${user.lastName}`}
                    </option>
                  ))}
                </select>
                <p className="text-xs text-slate-400 mt-2">Hold Ctrl/Cmd to select multiple users</p>
              </div>

              {/* Dates - Side by Side */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    Start Date <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    name="startDate"
                    value={formData.startDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-40 transition"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">
                    End Date <span className="text-rose-400">*</span>
                  </label>
                  <input
                    type="date"
                    name="endDate"
                    value={formData.endDate}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-40 transition"
                    required
                  />
                </div>
              </div>

              {/* Project Description */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Project Description <span className="text-rose-400">*</span>
                </label>
                <textarea
                  name="description"
                  placeholder="Enter detailed project description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-40 transition resize-none"
                  rows="5"
                  required
                />
              </div>

              {/* Status */}
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">
                  Project Status <span className="text-rose-400">*</span>
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-40 transition"
                  required
                >
                  <option value="planning">Planning</option>
                  <option value="active">Active</option>
                  <option value="completed">Completed</option>
                  <option value="on-hold">On Hold</option>
                </select>
              </div>

              {/* Form Actions */}
              <div className="flex items-center gap-4 pt-6">
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center gap-2 px-6 py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:from-cyan-600 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-40 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <MdSave className="w-5 h-5" />
                  {loading ? 'Creating...' : 'Create Project'}
                </button>
                
                <button
                  type="button"
                  onClick={handleCancel}
                  className="px-6 py-3 rounded-lg bg-slate-700/60 border border-slate-600 text-slate-300 font-medium hover:bg-slate-600/60 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-opacity-40 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
  );
}

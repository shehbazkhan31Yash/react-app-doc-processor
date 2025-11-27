import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { createProject, fetchProjects, fetchUsers } from '../../store/slices/projectsSlice';
import { MdAdd, MdClose, MdDescription, MdPeople } from 'react-icons/md';


export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  const { projects, users, loading, error } = useAppSelector((state) => state.projects);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    projectManager: '',
    members: [],
    startDate: '',
    endDate: '',
    description: '',
    status: 'pending' 
  });

  // Fetch projects and users on component mount
  useEffect(() => {
    dispatch(fetchProjects());
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
    if (formData.name.trim() && formData.description.trim()) {
      await dispatch(createProject(formData));
      setFormData({
        name: '',
        projectManager: '',
        members: [],
        startDate: '',
        endDate: '',
        description: '',
        status: 'pending'
      });
      setShowForm(false);
    }
  };

  return (
    

      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-sky-900 p-6">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 -top-24 w-96 h-96 rounded-full bg-gradient-to-tr from-violet-700/30 to-cyan-700/20 blur-3xl transform rotate-12" />
          <div className="absolute right-0 bottom-0 w-80 h-80 rounded-2xl bg-gradient-to-bl from-rose-800/20 to-yellow-700/10 blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Admin Dashboard</h1>
            <p className="text-slate-300 mt-2">Create and manage all projects</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-300">
              {error}
            </div>
          )}
          
          <div className="mb-8">
            <button
              onClick={() => setShowForm(prevShowForm => !prevShowForm)}

              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 text-white font-semibold shadow-lg transform transition duration-300 hover:scale-105 active:scale-95"
            >
              {showForm ? (
                <>
                  <MdClose className="w-5 h-5" />
                  Cancel
                </>
              ) : (
                <>
                  <MdAdd className="w-5 h-5" />
                  Create New Project
                </>
              )}
            </button>

            {showForm && (
              <div className="mt-6 bg-slate-900/60 border border-slate-800/60 rounded-3xl p-8 shadow-2xl backdrop-blur-md max-w-2xl">
                <h3 className="text-2xl font-bold text-white mb-6">New Project Details</h3>
                
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Project Name</label>
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

                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Project Manager</label>
                    <select
                      name="projectManager"
                      value={formData.projectManager}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-40 transition"
                      required
                    >
                      <option value="">Select Manager</option>
                      {users.filter(u => u.role === 'manager').map(user => (
                        <option key={user._id} value={user._id}>{user.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Team Members</label>
                    <select
                      name="members"
                      multiple
                      value={formData.members}
                      onChange={handleMembersChange}
                      className="w-full px-4 py-3 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-40 transition"
                      style={{ minHeight: '100px' }}
                    >
                      {users.filter(u => u.role === 'user').map(user => (
                        <option key={user._id} value={user._id}>{user.name}</option>
                      ))}
                    </select>
                    <p className="text-xs text-slate-400 mt-1">Hold Ctrl/Cmd to select multiple</p>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm text-slate-300 mb-2">Start Date</label>
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
                      <label className="block text-sm text-slate-300 mb-2">End Date</label>
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

                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Project Description</label>
                    <textarea
                      name="description"
                      placeholder="Enter project description"
                      value={formData.description}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-40 transition resize-none"
                      rows="4"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Status</label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleChange}
                      className="w-full px-4 py-3 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-40 transition"
                      required
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                    </select>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 text-white font-semibold shadow-lg transform transition duration-300 hover:scale-105 active:scale-95 disabled:opacity-60"
                  >
                    {loading ? 'Creating...' : 'Create Project'}
                  </button>
                </form>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-6">All Projects</h2>
            
            {loading && <p className="text-slate-300">Loading projects...</p>}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div 
                  key={project._id} 
                  className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-6 shadow-xl backdrop-blur-md hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <h3 className="font-bold text-xl text-white mb-3">{project.name}</h3>
                  <p className="text-slate-300 mb-4 text-sm">{project.description}</p>
                  
                  <div className="flex flex-col gap-3">
                    <div className="flex items-center gap-2 pt-2 border-t border-slate-700/50">
                      <MdPeople className="w-5 h-5 text-slate-400" />
                      <span className="text-sm text-slate-300">
                        Members: <span className="text-cyan-400 font-medium">{project.members?.length || 0}</span>
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">
                      <p>Start: {new Date(project.startDate).toLocaleDateString()}</p>
                      <p>End: {new Date(project.endDate).toLocaleDateString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    
  );
}

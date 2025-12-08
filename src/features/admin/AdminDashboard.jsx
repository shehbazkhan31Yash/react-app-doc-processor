import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchProjects, deleteProject, updateProject } from '../../store/slices/projectsSlice';
import { MdAdd, MdPeople, MdEdit, MdDelete, MdVisibility, MdClose } from 'react-icons/md';


export default function AdminDashboard() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { projects, loading, error } = useAppSelector((state) => state.projects);
  
  const [selectedProject, setSelectedProject] = useState(null);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [editFormData, setEditFormData] = useState({});

  // Fetch projects on component mount
  useEffect(() => {
    dispatch(fetchProjects());
  }, [dispatch]);

  const handleView = (project) => {
    setSelectedProject(project);
    setShowViewModal(true);
  };

  const handleEdit = (project) => {
    setSelectedProject(project);
    setEditFormData({
      name: project.name,
      description: project.description,
      status: project.status,
      startDate: project.startDate?.split('T')[0],
      endDate: project.endDate?.split('T')[0]
    });
    setShowEditModal(true);
  };

  const handleDelete = (project) => {
    setSelectedProject(project);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (selectedProject) {
      await dispatch(deleteProject(selectedProject._id));
      setShowDeleteModal(false);
      setSelectedProject(null);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    if (selectedProject) {
      await dispatch(updateProject({ id: selectedProject._id, projectData: editFormData }));
      setShowEditModal(false);
      setSelectedProject(null);
    }
  };

  const closeModals = () => {
    setShowViewModal(false);
    setShowEditModal(false);
    setShowDeleteModal(false);
    setSelectedProject(null);
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
              onClick={() => navigate('/admin/create-project')}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 text-white font-semibold shadow-lg transform transition duration-300 hover:scale-105 active:scale-95"
            >
              <MdAdd className="w-5 h-5" />
              Create New Project
            </button>
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
                    <div className="text-xs text-slate-400 mb-4">
                      <p>Start: {new Date(project.startDate).toLocaleDateString()}</p>
                      <p>End: {new Date(project.endDate).toLocaleDateString()}</p>
                      <p>Status: <span className="text-cyan-400 capitalize">{project.status}</span></p>
                    </div>
                    
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleView(project)}
                        className="flex-1 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition flex items-center justify-center gap-1"
                      >
                        <MdVisibility className="w-4 h-4" />
                        View
                      </button>
                      <button
                        onClick={() => handleEdit(project)}
                        className="flex-1 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition flex items-center justify-center gap-1"
                      >
                        <MdEdit className="w-4 h-4" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project)}
                        className="flex-1 px-3 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition flex items-center justify-center gap-1"
                      >
                        <MdDelete className="w-4 h-4" />
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* View Modal */}
        {showViewModal && selectedProject && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-white">Project Details</h3>
                <button onClick={closeModals} className="text-slate-400 hover:text-white">
                  <MdClose className="w-6 h-6" />
                </button>
              </div>
              <div className="space-y-4 text-slate-300">
                <div><strong>Name:</strong> {selectedProject.name}</div>
                <div><strong>Description:</strong> {selectedProject.description}</div>
                <div><strong>Status:</strong> <span className="capitalize text-cyan-400">{selectedProject.status}</span></div>
                <div><strong>Start Date:</strong> {new Date(selectedProject.startDate).toLocaleDateString()}</div>
                <div><strong>End Date:</strong> {new Date(selectedProject.endDate).toLocaleDateString()}</div>
                <div><strong>Members:</strong> {selectedProject.members?.length || 0}</div>
              </div>
            </div>
          </div>
        )}

        {/* Edit Modal */}
        {showEditModal && selectedProject && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-white">Edit Project</h3>
                <button onClick={closeModals} className="text-slate-400 hover:text-white">
                  <MdClose className="w-6 h-6" />
                </button>
              </div>
              <form onSubmit={handleEditSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                  <input
                    type="text"
                    value={editFormData.name || ''}
                    onChange={(e) => setEditFormData({...editFormData, name: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Description</label>
                  <textarea
                    value={editFormData.description || ''}
                    onChange={(e) => setEditFormData({...editFormData, description: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    rows="3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-300 mb-2">Status</label>
                  <select
                    value={editFormData.status || ''}
                    onChange={(e) => setEditFormData({...editFormData, status: e.target.value})}
                    className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
                  >
                    <option value="planning">Planning</option>
                    <option value="active">Active</option>
                    <option value="completed">Completed</option>
                    <option value="on-hold">On Hold</option>
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={editFormData.startDate || ''}
                      onChange={(e) => setEditFormData({...editFormData, startDate: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-300 mb-2">End Date</label>
                    <input
                      type="date"
                      value={editFormData.endDate || ''}
                      onChange={(e) => setEditFormData({...editFormData, endDate: e.target.value})}
                      className="w-full px-4 py-3 rounded-lg bg-slate-800 border border-slate-700 text-white"
                    />
                  </div>
                </div>
                <div className="flex gap-4 pt-4">
                  <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition"
                  >
                    {loading ? 'Updating...' : 'Update Project'}
                  </button>
                  <button
                    type="button"
                    onClick={closeModals}
                    className="flex-1 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Delete Modal */}
        {showDeleteModal && selectedProject && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-slate-900 rounded-2xl p-6 max-w-md w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-2xl font-bold text-white">Delete Project</h3>
                <button onClick={closeModals} className="text-slate-400 hover:text-white">
                  <MdClose className="w-6 h-6" />
                </button>
              </div>
              <p className="text-slate-300 mb-6">
                Are you sure you want to delete <strong>{selectedProject.name}</strong>? This action cannot be undone.
              </p>
              <div className="flex gap-4">
                <button
                  onClick={confirmDelete}
                  disabled={loading}
                  className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg transition"
                >
                  {loading ? 'Deleting...' : 'Delete'}
                </button>
                <button
                  onClick={closeModals}
                  className="flex-1 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    
  );
}

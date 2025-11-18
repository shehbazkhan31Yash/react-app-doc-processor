import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addProject } from '../../store/slices/projectsSlice';
import { MdAdd, MdClose, MdDescription, MdPeople } from 'react-icons/md';

export default function AdminDashboard() {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);
  const { projects } = useAppSelector((state) => state.projects);
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    documentURL: ''
  });

  const handleCreateProject = (e) => {
    e.preventDefault();
    if (formData.name.trim() && formData.description.trim()) {
      dispatch(addProject({
        ...formData,
        createdBy: user.id
      }));
      setFormData({ name: '', description: '', documentURL: '' });
      setShowForm(false);
    }
  };

  return (
    <>
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
          
          <div className="mb-8">
            <button
              onClick={() => setShowForm(!showForm)}
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
                
                <form onSubmit={handleCreateProject} className="space-y-4">
                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Project Name</label>
                    <input
                      type="text"
                      placeholder="Enter project name"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-40 transition"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Project Description</label>
                    <textarea
                      placeholder="Enter project description"
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-40 transition resize-none"
                      rows="4"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm text-slate-300 mb-2">Document URL</label>
                    <input
                      type="text"
                      placeholder="https://example.com/document"
                      value={formData.documentURL}
                      onChange={(e) => setFormData({ ...formData, documentURL: e.target.value })}
                      className="w-full px-4 py-3 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-40 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 text-white font-semibold shadow-lg transform transition duration-300 hover:scale-105 active:scale-95"
                  >
                    Create Project
                  </button>
                </form>
              </div>
            )}
          </div>

          <div>
            <h2 className="text-3xl font-bold text-white mb-6">All Projects</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div 
                  key={project.id} 
                  className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-6 shadow-xl backdrop-blur-md hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <h3 className="font-bold text-xl text-white mb-3">{project.name}</h3>
                  <p className="text-slate-300 mb-4 text-sm">{project.description}</p>
                  
                  <div className="flex flex-col gap-3">
                    <a
                      href={project.documentURL}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium shadow-md hover:shadow-lg transform transition duration-200 hover:scale-105"
                    >
                      <MdDescription className="w-4 h-4" />
                      View Document
                    </a>

                    <div className="flex items-center gap-2 pt-2 border-t border-slate-700/50">
                      <MdPeople className="w-5 h-5 text-slate-400" />
                      <span className="text-sm text-slate-300">
                        Assigned: <span className="text-cyan-400 font-medium">{project.assignedTo.length > 0 ? project.assignedTo.length : 'None'}</span>
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { addProject } from '../../store/slices/projectsSlice';

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

  // const adminProjects = projects.filter(p => p.createdBy === user.id);

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
      
      <div className="mb-8">
        <button
          onClick={() => setShowForm(!showForm)}
          className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700"
        >
          {showForm ? 'Cancel' : 'Create New Project'}
        </button>

        {showForm && (
          <form onSubmit={handleCreateProject} className="mt-4 p-6 bg-gray-50 rounded-lg max-w-md">
            <input
              type="text"
              placeholder="Project Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full mb-4 px-3 py-2 border rounded"
              required
            />
            <textarea
              placeholder="Project Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full mb-4 px-3 py-2 border rounded"
              required
            />
            <input
              type="text"
              placeholder="Document URL"
              value={formData.documentURL}
              onChange={(e) => setFormData({ ...formData, documentURL: e.target.value })}
              className="w-full mb-4 px-3 py-2 border rounded"
            />
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 rounded hover:bg-indigo-700"
            >
              Create Project
            </button>
          </form>
        )}
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">All Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="p-4 border rounded-lg bg-white shadow">
              <h3 className="font-bold text-lg mb-2">{project.name}</h3>
              <p className="text-gray-600 mb-3">{project.description}</p>
              <div className="flex gap-2">
                <a
                  href={project.documentURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  View Doc
                </a>
                <span className="text-sm text-gray-500 mt-1">
                  Assigned to: {project.assignedTo.length > 0 ? project.assignedTo.length : 'None'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

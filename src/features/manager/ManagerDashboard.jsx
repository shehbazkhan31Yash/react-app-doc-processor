import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { assignProjectToUser } from '../../store/slices/projectsSlice';

export default function ManagerDashboard() {
  const dispatch = useAppDispatch();
  const { projects, users } = useAppSelector((state) => state.projects);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedUser, setSelectedUser] = useState('');

  const userList = users.filter(u => u.role === 'user');

  const handleAssignProject = () => {
    if (selectedProject && selectedUser) {
      dispatch(assignProjectToUser({
        projectId: selectedProject,
        userId: parseInt(selectedUser)
      }));
      setSelectedProject(null);
      setSelectedUser('');
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">Manager Dashboard</h1>

      <div className="mb-8 p-6 bg-gray-50 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Assign Project to User</h2>
        <div className="flex gap-4 flex-wrap">
          <select
            value={selectedProject || ''}
            onChange={(e) => setSelectedProject(e.target.value ? parseInt(e.target.value) : null)}
            className="px-3 py-2 border rounded"
          >
            <option value="">Select Project</option>
            {projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          <select
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="px-3 py-2 border rounded"
          >
            <option value="">Select User</option>
            {userList.map(u => (
              <option key={u.id} value={u.id}>{u.name}</option>
            ))}
          </select>

          <button
            onClick={handleAssignProject}
            disabled={!selectedProject || !selectedUser}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 disabled:opacity-50"
          >
            Assign
          </button>
        </div>
      </div>

      <div>
        <h2 className="text-2xl font-bold mb-4">All Projects</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <div key={project.id} className="p-4 border rounded-lg bg-white shadow">
              <h3 className="font-bold text-lg mb-2">{project.name}</h3>
              <p className="text-gray-600 mb-3">{project.description}</p>
              <div className="flex gap-2 mb-2">
                <a
                  href={project.documentURL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
                >
                  View Doc
                </a>
              </div>
              <p className="text-sm text-gray-500">
                Assigned to: {project.assignedTo.length > 0 ? project.assignedTo.join(', ') : 'No one'}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

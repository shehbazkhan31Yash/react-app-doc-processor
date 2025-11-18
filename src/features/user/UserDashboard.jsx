import React from 'react';
import { useAppSelector } from '../../store/hooks';

export default function UserDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const { projects } = useAppSelector((state) => state.projects);

  const userProjects = projects.filter(p => p.assignedTo.includes(user.id));

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-8">My Projects</h1>

      {userProjects.length === 0 ? (
        <p className="text-gray-600">No projects assigned yet.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {userProjects.map((project) => (
            <div key={project.id} className="p-4 border rounded-lg bg-white shadow">
              <h3 className="font-bold text-lg mb-2">{project.name}</h3>
              <p className="text-gray-600 mb-3">{project.description}</p>
              <a
                href={project.documentURL}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-500 text-white px-3 py-1 rounded text-sm hover:bg-blue-600"
              >
                View Document
              </a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

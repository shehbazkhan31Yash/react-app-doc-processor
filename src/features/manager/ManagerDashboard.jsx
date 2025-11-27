
import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { assignProjectToUser } from '../../store/slices/projectsSlice';
import { MdAssignment, MdPeople, MdDescription } from 'react-icons/md';


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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-sky-900 p-6">
        
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 -top-24 w-96 h-96 rounded-full bg-gradient-to-tr from-violet-700/30 to-cyan-700/20 blur-3xl transform rotate-12" />
          <div className="absolute right-0 bottom-0 w-80 h-80 rounded-2xl bg-gradient-to-bl from-rose-800/20 to-yellow-700/10 blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          
          <div className="mb-8">
            <h1 className="text-4xl font-extrabold text-white tracking-tight">Manager Dashboard</h1>
            <p className="text-slate-300 mt-2">Assign projects and manage your team</p>
          </div>

          <div className="mb-8 bg-slate-900/60 border border-slate-800/60 rounded-3xl p-6 shadow-2xl backdrop-blur-md">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-cyan-500/20 flex items-center justify-center border border-violet-500/30">
                <MdAssignment className="w-6 h-6 text-violet-400" />
              </div>
              <h2 className="text-2xl font-bold text-white">Assign Project to User</h2>
            </div>

            <div className="flex gap-4 flex-wrap">
              <select
                value={selectedProject || ''}
                onChange={(e) => setSelectedProject(e.target.value ? parseInt(e.target.value) : null)}
                className="px-4 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-40 transition"
              >
                <option value="">Select Project</option>
                {projects.map(p => (
                  <option key={p.id} value={p.id}>{p.name}</option>
                ))}
              </select>

              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="px-4 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-40 transition"
              >
                <option value="">Select User</option>
                {userList.map(u => (
                  <option key={u.id} value={u.id}>{u.name}</option>
                ))}
              </select>

              <button
                onClick={handleAssignProject}
                disabled={!selectedProject || !selectedUser}
                className="px-6 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 text-white font-semibold shadow-lg transform transition duration-300 hover:scale-105 active:scale-95 disabled:opacity-60 disabled:hover:scale-100"
              >
                Assign Project
              </button>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 flex items-center justify-center border border-cyan-500/30">
                <MdDescription className="w-6 h-6 text-cyan-400" />
              </div>
              <h2 className="text-3xl font-bold text-white">All Projects</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div 
                  key={project.id} 
                  className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-6 shadow-xl backdrop-blur-md hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <h3 className="font-bold text-xl mb-3 text-white text_center">{project.name}</h3>
                  <p className="text-slate-300 mb-4 text-sm leading-relaxed">{project.description}</p>
                  
                  <a
                    href={project.documentURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mb-4 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-500 to-cyan-500 text-white text-sm font-medium shadow-md hover:shadow-lg transform transition duration-200 hover:scale-105"
                  >
                    View Document
                  </a>

                  <div className="flex items-start gap-2 pt-3 border-t border-slate-700/50">
                    <MdPeople className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Assigned to:</p>
                      <p className="text-sm text-slate-200">
                        {project.assignedTo.length > 0 ? project.assignedTo.join(', ') : 'No one assigned'}
                      </p>
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

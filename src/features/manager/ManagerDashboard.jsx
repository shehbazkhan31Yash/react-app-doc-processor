
import React, { useState, useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { assignProjectToUser, fetchManagerProjects } from '../../store/slices/projectsSlice';
import { fetchEmployees } from '../../store/slices/userSlice';
import { MdAssignment, MdPeople, MdDescription } from 'react-icons/md';


export default function ManagerDashboard() {
  const dispatch = useAppDispatch();
  const { projects, loading, error } = useAppSelector((state) => state.projects);
  const { employees } = useAppSelector((state) => state.users);
  const [selectedProject, setSelectedProject] = useState(null);
  const [selectedUser, setSelectedUser] = useState('');

  // Fetch manager's projects and employees on component mount
  useEffect(() => {
    dispatch(fetchManagerProjects());
    dispatch(fetchEmployees());
  }, [dispatch]);

  const userList = employees || [];

  const handleAssignProject = async () => {
    if (selectedProject && selectedUser) {
      await dispatch(assignProjectToUser({
        projectId: selectedProject,
        userId: selectedUser
      }));
      setSelectedProject(null);
      setSelectedUser('');
      // Refresh projects after assignment
      dispatch(fetchManagerProjects());
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
                onChange={(e) => setSelectedProject(e.target.value || null)}
                className="px-4 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-40 transition"
              >
                <option value="">Select Project</option>
                {projects.map(p => (
                  <option key={p._id} value={p._id}>{p.name}</option>
                ))}
              </select>

              <select
                value={selectedUser}
                onChange={(e) => setSelectedUser(e.target.value)}
                className="px-4 py-2 rounded-lg bg-slate-800/60 border border-slate-700 text-slate-100 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-40 transition"
              >
                <option value="">Select User</option>
                {userList.map(u => (
                  <option key={u.id} value={u.id}>{u.firstName} {u.lastName}</option>
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

            {loading && <p className="text-slate-300">Loading projects...</p>}
            {error && (
              <div className="mb-4 p-4 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-300">
                {error}
              </div>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div 
                  key={project._id} 
                  className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-6 shadow-xl backdrop-blur-md hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <h3 className="font-bold text-xl mb-3 text-white">{project.name}</h3>
                  <p className="text-slate-300 mb-4 text-sm leading-relaxed">{project.description}</p>
                  
                  <div className="mb-4">
                    <p className="text-xs text-slate-400 mb-1">Status:</p>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400 capitalize">
                      {project.status}
                    </span>
                  </div>

                  <div className="flex items-start gap-2 pt-3 border-t border-slate-700/50">
                    <MdPeople className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Team Members:</p>
                      <p className="text-sm text-slate-200">
                        {project.members?.length > 0 ? `${project.members.length} members` : 'No members assigned'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3 text-xs text-slate-400">
                    <p>Start: {new Date(project.startDate).toLocaleDateString()}</p>
                    <p>End: {new Date(project.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
            
            {!loading && projects.length === 0 && (
              <div className="text-center py-12">
                <p className="text-slate-400 text-lg">No projects assigned to you yet.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    
  );
}

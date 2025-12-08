import React, { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchUserProjects } from '../../store/slices/projectsSlice';
import { MdDescription, MdPeople } from 'react-icons/md';


export default function UserDashboard() {
  const dispatch = useAppDispatch();
  const { projects, loading, error } = useAppSelector((state) => state.projects);

  // Fetch user's assigned projects on component mount
  useEffect(() => {
    dispatch(fetchUserProjects());
  }, [dispatch]);

  return (
    

      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-sky-900 p-6">
        
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 -top-24 w-96 h-96 rounded-full bg-gradient-to-tr from-violet-700/30 to-cyan-700/20 blur-3xl transform rotate-12" />
          <div className="absolute right-0 bottom-0 w-80 h-80 rounded-2xl bg-gradient-to-bl from-rose-800/20 to-yellow-700/10 blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-8">My Projects</h1>

          {error && (
            <div className="mb-4 p-4 bg-rose-500/20 border border-rose-500/30 rounded-xl text-rose-300">
              {error}
            </div>
          )}

          {loading && <p className="text-slate-300">Loading your projects...</p>}

          {!loading && projects.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800/60 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
              <p className="text-slate-300 text-center text-lg">No projects assigned to you yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div 
                  key={project._id} 
                  className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-6 shadow-xl backdrop-blur-md hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <h3 className="font-bold text-xl text-white mb-3">{project.name}</h3>
                  <p className="text-slate-300 mb-4 text-sm">{project.description}</p>
                  
                  <div className="mb-4">
                    <p className="text-xs text-slate-400 mb-1">Status:</p>
                    <span className="inline-block px-3 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400 capitalize">
                      {project.status}
                    </span>
                  </div>

                  <div className="mb-4">
                    <p className="text-xs text-slate-400 mb-1">Project Manager:</p>
                    <p className="text-sm text-slate-200">
                      {project.projectManager ? 
                        `${project.projectManager.firstName} ${project.projectManager.lastName}` : 
                        'Not assigned'
                      }
                    </p>
                  </div>

                  <div className="flex items-start gap-2 pt-3 border-t border-slate-700/50 mb-4">
                    <MdPeople className="w-5 h-5 text-slate-400 mt-0.5" />
                    <div>
                      <p className="text-xs text-slate-400 mb-1">Team Members:</p>
                      <p className="text-sm text-slate-200">
                        {project.members?.length > 0 ? `${project.members.length} members` : 'Just you'}
                      </p>
                    </div>
                  </div>
                  
                  <div className="text-xs text-slate-400">
                    <p>Start: {new Date(project.startDate).toLocaleDateString()}</p>
                    <p>End: {new Date(project.endDate).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    
  );
}

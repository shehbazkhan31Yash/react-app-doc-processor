import React from 'react';
import { useAppSelector } from '../../store/hooks';
import { MdDescription } from 'react-icons/md';


export default function UserDashboard() {
  const { user } = useAppSelector((state) => state.auth);
  const { projects } = useAppSelector((state) => state.projects);

  const userProjects = projects.filter(p => p.assignedTo.includes(user.id));

  return (
    

      
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-indigo-950 to-sky-900 p-6">
        
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -left-24 -top-24 w-96 h-96 rounded-full bg-gradient-to-tr from-violet-700/30 to-cyan-700/20 blur-3xl transform rotate-12" />
          <div className="absolute right-0 bottom-0 w-80 h-80 rounded-2xl bg-gradient-to-bl from-rose-800/20 to-yellow-700/10 blur-2xl" />
        </div>

        <div className="relative max-w-7xl mx-auto">
          
          <h1 className="text-4xl font-extrabold text-white tracking-tight mb-8">My Projects</h1>

          {userProjects.length === 0 ? (
            <div className="bg-slate-900/60 border border-slate-800/60 rounded-3xl p-8 shadow-2xl backdrop-blur-md">
              <p className="text-slate-300 text-center text-lg">No projects assigned yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProjects.map((project) => (
                <div 
                  key={project.id} 
                  className="bg-slate-900/60 border border-slate-800/60 rounded-2xl p-6 shadow-xl backdrop-blur-md hover:shadow-2xl transition-all duration-300 hover:scale-105"
                >
                  <h3 className="font-bold text-xl text-white mb-3">{project.name}</h3>
                  <p className="text-slate-300 mb-4 text-sm">{project.description}</p>
                  
                  <a
                    href={project.documentURL}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 via-indigo-600 to-violet-600 text-white font-semibold shadow-lg transform transition duration-300 hover:scale-105 active:scale-95"
                  >
                    <MdDescription className="w-5 h-5" />
                    View Document
                  </a>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    
  );
}

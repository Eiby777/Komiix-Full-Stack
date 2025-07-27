import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useDashboard } from '../../../hooks/useDashboard';

export default function Sidebar({ darkMode, setActiveSection }) {
  const navigate = useNavigate();
  const { toggleSidebar, isSidebarCollapsed } = useDashboard();

  // Calculate sidebar width based on screen height
  const referenceScreenHeight = 952;
  const referenceSidebarWidth = 288;
  const minSidebarWidth = 240;
  const maxSidebarWidth = 288;
  const sidebarWidth = isSidebarCollapsed 
    ? 20 
    : Math.min(Math.max((window.innerHeight / referenceScreenHeight) * referenceSidebarWidth, minSidebarWidth), maxSidebarWidth);

  // Calculate logo width based on sidebar width
  const logoWidth = isSidebarCollapsed ? 16 : Math.min(sidebarWidth * 0.4167, 120); // 0.4167 = 120/288 to hit 120px at 288px sidebar width

  return (
    <>
      {/* Overlay para móviles - solo visible cuando el sidebar está abierto */}
      {!isSidebarCollapsed && (
        <div 
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 z-[1001] transition-opacity duration-300"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
          }}
        />
      )}
      
      {/* Sidebar */}
      <aside
        className={`
          fixed md:relative z-[1002] min-h-screen text-white transition-all duration-300 ease-in-out shadow-2xl
          ${isSidebarCollapsed 
            ? '-translate-x-full md:translate-x-0 md:w-20' 
            : 'translate-x-0'
          } 
          ${darkMode 
            ? 'bg-gradient-to-b from-gray-900 to-black' 
            : 'bg-gradient-to-b from-blue-800 to-indigo-900'
          }
          md:transform-none
        `}
        style={{ width: `${sidebarWidth}px` }}
      >
        {/* Close Button - Solo visible en móviles */}
        <button
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            toggleSidebar();
          }}
          className="md:hidden absolute top-4 right-4 p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-all duration-200 z-[1003] focus:outline-none focus:ring-2 focus:ring-white/50"
          aria-label="Cerrar menú"
          type="button"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 pointer-events-none"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Header */}
        <div className="p-3 pb-3 border-b border-white/10 relative">
          <h2
            className={`text-2xl font-extrabold tracking-tight transition-all duration-300 ${
              isSidebarCollapsed ? 'text-center text-lg md:opacity-0' : 'text-left'
            }`}
          >
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-white to-blue-200">
              <div className="flex justify-center">
                <img 
                  src="/logo.png" 
                  alt="Komiix" 
                  className="h-auto" 
                  style={{ width: `${logoWidth}px` }} 
                />
              </div>
            </span>
          </h2>
        </div>

        {/* Navigation */}
        <nav className="p-4">
          <ul className="space-y-3">
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/');
                  // Cerrar sidebar en móviles después de navegar
                  if (window.innerWidth < 768) {
                    toggleSidebar();
                  }
                }}
                className={`flex items-center p-3 rounded-lg transition-all duration-200 group ${
                  isSidebarCollapsed ? 'justify-center' : 'space-x-3 hover:bg-white/10'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                {!isSidebarCollapsed && (
                  <span className="text-sm font-medium group-hover:text-blue-200 transition-colors duration-200">
                    Ir a la Página Principal
                  </span>
                )}
              </a>
            </li>

            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection('projects');
                  // Cerrar sidebar en móviles después de seleccionar
                  if (window.innerWidth < 768) {
                    toggleSidebar();
                  }
                }}
                className={`flex items-center p-3 rounded-lg transition-all duration-200 group ${
                  isSidebarCollapsed ? 'justify-center' : 'space-x-3 hover:bg-white/10'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M9 12h6m-3-3v6m-8.5 6.5h17a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v14a2 2 0 002 2z"
                  />
                </svg>
                {!isSidebarCollapsed && (
                  <span className="text-sm font-medium group-hover:text-blue-200 transition-colors duration-200">
                    Proyectos
                  </span>
                )}
              </a>
            </li>
            
            <li>
              <a
                href="#"
                onClick={(e) => {
                  e.preventDefault();
                  setActiveSection('mergeImages');
                  // Cerrar sidebar en móviles después de seleccionar
                  if (window.innerWidth < 768) {
                    toggleSidebar();
                  }
                }}
                className={`flex items-center p-3 rounded-lg transition-all duration-200 group ${
                  isSidebarCollapsed ? 'justify-center' : 'space-x-3 hover:bg-white/10'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-6 h-6 group-hover:scale-110 transition-transform duration-200"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={1.5}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M14.121 14.121L19 19m-7-7l7-7m-7 7l-2.879 2.879M12 12L9.121 9.121m0 5.758a3 3 0 10-4.243 4.243 3 3 0 004.243-4.243zm0-5.758a3 3 0 10-4.243-4.243 3 3 0 004.243 4.243z"
                  />
                </svg>
                {!isSidebarCollapsed && (
                  <span className="text-sm font-medium group-hover:text-blue-200 transition-colors duration-200">
                    Unir y Recortar
                  </span>
                )}
              </a>
            </li>
          </ul>
        </nav>

        {/* Footer */}
        <div className="absolute bottom-0 w-full p-4">
          <p
            className={`text-xs text-white/60 transition-opacity duration-300 ${
              isSidebarCollapsed ? 'opacity-0 md:opacity-100 text-center' : 'opacity-100'
            }`}
          >
            © 2025 Komiix
          </p>
        </div>
      </aside>
    </>
  );
}
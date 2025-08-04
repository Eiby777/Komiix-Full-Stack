import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBookOpen, faGraduationCap, faLayerGroup, faWandMagicSparkles,
  faImage, faSquare as faSquareRegular, faPaintBrush, faFont, 
  faArrowUpFromBracket, faLightbulb, faHandPaper, faPlus, faSearch,
  faEraser, faClone, faMagic, faPen, faBox, faEye, faSliders,
  faUsers, faCog, faQuestionCircle, faRocket
} from '@fortawesome/free-solid-svg-icons';

const DocsSidebar = ({ activeSection, setActiveSection, isSidebarOpen, setIsSidebarOpen, isHeaderVisible }) => {
  const menuSections = [
    {
      id: 'getting-started',
      title: 'Comenzando',
      icon: faRocket,
      items: [
        { id: 'introduction', title: 'Introducción', icon: faBookOpen },
        { id: 'first-steps', title: 'Primeros Pasos', icon: faGraduationCap },
        { id: 'dashboard', title: 'Dashboard', icon: faLayerGroup },
      ]
    },
    {
      id: 'workflow',
      title: 'Flujo de Trabajo',
      icon: faWandMagicSparkles,
      items: [
        { id: 'areas-overview', title: 'Áreas de Trabajo', icon: faWandMagicSparkles },
        { id: 'original', title: '1. Original', icon: faImage },
        { id: 'annotation', title: '2. Anotación', icon: faSquareRegular },
        { id: 'cleanup', title: '3. Limpieza', icon: faPaintBrush },
        { id: 'translation', title: '4. Traducción', icon: faFont },
        { id: 'export', title: '5. Exportación', icon: faArrowUpFromBracket },
      ]
    },
    {
      id: 'tools-detail',
      title: 'Herramientas Detalladas',
      icon: faCog,
      items: [
        { id: 'annotation-tools', title: 'Herramientas de Anotación', icon: faSquareRegular },
        { id: 'cleanup-tools', title: 'Herramientas de Limpieza', icon: faPaintBrush },
        { id: 'translation-tools', title: 'Herramientas de Traducción', icon: faFont },
        { id: 'navigation-controls', title: 'Controles de Navegación', icon: faHandPaper },
      ]
    },
    {
      id: 'advanced',
      title: 'Guías Avanzadas',
      icon: faUsers,
      items: [
        { id: 'use-cases', title: 'Casos de Uso', icon: faLightbulb },
        { id: 'best-practices', title: 'Mejores Prácticas', icon: faUsers },
        { id: 'troubleshooting', title: 'Solución de Problemas', icon: faQuestionCircle },
        { id: 'glossary', title: 'Glosario de Términos', icon: faBookOpen },
      ]
    }
  ];

  const handleItemClick = (itemId) => {
    setActiveSection(itemId);
    setIsSidebarOpen(false); // Close mobile sidebar on selection
  };

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className={`
        fixed left-0 w-80 bg-white dark:bg-gray-800 
        border-r border-gray-200 dark:border-gray-700 overflow-y-auto z-30
        transform transition-all duration-300 ease-in-out
        ${isHeaderVisible ? 'top-20 h-[calc(100vh-5rem)]' : 'top-0 h-screen'}
        ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6">
          {/* Header */}
          <div className="mb-8">
            <h2 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-indigo-500 bg-clip-text text-transparent">
              Documentación
            </h2>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
              Guía completa de Komiix
            </p>
          </div>

          {/* Close button for mobile */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="lg:hidden absolute top-4 right-4 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          {/* Navigation Menu */}
          <nav className="space-y-6">
            {menuSections.map((section) => (
              <div key={section.id} className="space-y-2">
                <div className="flex items-center space-x-3 px-3 py-2 text-sm font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider">
                  <FontAwesomeIcon icon={section.icon} className="w-4 h-4" />
                  <span>{section.title}</span>
                </div>
                <div className="space-y-1 ml-2">
                  {section.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleItemClick(item.id)}
                      className={`w-full text-left flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        activeSection === item.id
                          ? 'bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 shadow-sm border-l-4 border-blue-500'
                          : 'text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700 hover:text-blue-600 dark:hover:text-blue-400'
                      }`}
                    >
                      <FontAwesomeIcon 
                        icon={item.icon} 
                        className={`w-4 h-4 ${
                          activeSection === item.id 
                            ? 'text-blue-600 dark:text-blue-400' 
                            : 'text-gray-400'
                        }`} 
                      />
                      <span className="text-sm font-medium">{item.title}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </nav>

          {/* Footer */}
          <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-4 rounded-lg">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 text-sm mb-2">
                ¿Necesitas ayuda?
              </h4>
              <p className="text-xs text-blue-700 dark:text-blue-200 mb-3">
                Únete a nuestra comunidad en Discord para soporte directo
              </p>
              <button
                onClick={() => window.open('https://discord.gg/GU53CsXabn', '_blank')}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium py-2 px-3 rounded-md transition-colors duration-200"
              >
                Unirse a Discord
              </button>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DocsSidebar;
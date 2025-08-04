import React, { createContext, useState } from 'react';
import Introduction from './sections/Introduction.jsx';
import FirstSteps from './sections/FirstSteps';
import Dashboard from './sections/Dashboard';
/*import AreasOverview from './sections/AreasOverview';
import OriginalArea from './sections/OriginalArea';
import AnnotationArea from './sections/AnnotationArea';
import CleanupArea from './sections/CleanupArea';
import TranslationArea from './sections/TranslationArea';
import ExportArea from './sections/ExportArea';
import AnnotationTools from './sections/AnnotationTools';
import CleanupTools from './sections/CleanupTools';
import TranslationTools from './sections/TranslationTools';
import NavigationControls from './sections/NavigationControls';
import UseCases from './sections/UseCases';
import BestPractices from './sections/BestPractices';
import Troubleshooting from './sections/Troubleshooting';
import Glossary from './sections/Glossary';*/

// Create the context
export const DocsContext = createContext();

const DocsContent = ({ activeSection, setActiveSection }) => {
  // Context value that will be available to child components
  const contextValue = {
    activeSection,
    setActiveSection
  };
  const renderContent = () => {
    switch (activeSection) {
      case 'introduction':
        return <Introduction />;
      case 'first-steps':
        return <FirstSteps />;
      case 'dashboard':
        return <Dashboard />;
      case 'areas-overview':
        return <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Áreas de Trabajo - En Desarrollo
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Esta sección estará disponible próximamente.
          </p>
        </div>;
      case 'original':
        return <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Área Original - En Desarrollo
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Esta sección estará disponible próximamente.
          </p>
        </div>;
      case 'annotation':
        return <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Área de Anotación - En Desarrollo
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Esta sección estará disponible próximamente.
          </p>
        </div>;
      case 'cleanup':
        return <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Área de Limpieza - En Desarrollo
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Esta sección estará disponible próximamente.
          </p>
        </div>;
      case 'translation':
        return <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Área de Traducción - En Desarrollo
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Esta sección estará disponible próximamente.
          </p>
        </div>;
      case 'export':
        return <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Área de Exportación - En Desarrollo
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Esta sección estará disponible próximamente.
          </p>
        </div>;
      case 'annotation-tools':
        return <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Herramientas de Anotación - En Desarrollo
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Esta sección estará disponible próximamente.
          </p>
        </div>;
      case 'cleanup-tools':
        return <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Herramientas de Limpieza - En Desarrollo
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Esta sección estará disponible próximamente.
          </p>
        </div>;
      case 'translation-tools':
        return <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Herramientas de Traducción - En Desarrollo
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Esta sección estará disponible próximamente.
          </p>
        </div>;
      case 'navigation-controls':
        return <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Controles de Navegación - En Desarrollo
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Esta sección estará disponible próximamente.
          </p>
        </div>;
      case 'use-cases':
        return <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Casos de Uso - En Desarrollo
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Esta sección estará disponible próximamente.
          </p>
        </div>;
      case 'best-practices':
        return <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Mejores Prácticas - En Desarrollo
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Esta sección estará disponible próximamente.
          </p>
        </div>;
      case 'troubleshooting':
        return <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Solución de Problemas - En Desarrollo
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Esta sección estará disponible próximamente.
          </p>
        </div>;
      case 'glossary':
        return <div className="p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Glosario de Términos - En Desarrollo
          </h2>
          <p className="text-gray-600 dark:text-gray-300">
            Esta sección estará disponible próximamente.
          </p>
        </div>;
      default:
        return <Introduction />;
    }
  };

  return (
    <DocsContext.Provider value={contextValue}>
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg min-h-[calc(100vh-8rem)]">
        {renderContent()}
      </div>
    </DocsContext.Provider>
  );
};

export default DocsContent;
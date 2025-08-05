import React, { createContext, useState } from 'react';
import Introduction from './sections/Introduction.jsx';
import FirstSteps from './sections/FirstSteps';
import Dashboard from './sections/Dashboard';
import AreasOverview from './sections/AreasOverview';
import OriginalArea from './sections/OriginalArea';
import AnnotationArea from './sections/AnnotationArea';
import AnnotationTools from './sections/AnnotationTools';
import CleanupArea from './sections/CleanupArea';
import CleanupTools from './sections/CleanupTools';
import TranslationArea from './sections/TranslationArea';
import TranslationTools from './sections/TranslationTools';
import ExportArea from './sections/ExportArea';
import NavigationControls from './sections/NavigationControls';
import EditorHeader from './sections/EditorHeader';
import UseCases from './sections/UseCases';
import Troubleshooting from './sections/Troubleshooting';
import Glossary from './sections/Glossary';

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
        return <AreasOverview />;
      case 'original':
        return <OriginalArea />;
      case 'annotation':
        return <AnnotationArea />;
      case 'cleanup':
        return <CleanupArea />;
      case 'translation':
        return <TranslationArea />;
      case 'export':
        return <ExportArea />;
      case 'annotation-tools':
        return <AnnotationTools />;
      case 'cleanup-tools':
        return <CleanupTools />;
      case 'translation-tools':
        return <TranslationTools />;
      case 'navigation-controls':
        return <NavigationControls />;
      case 'editor-header':
        return <EditorHeader />;
      case 'use-cases':
        return <UseCases />;
      case 'troubleshooting':
        return <Troubleshooting />;
      case 'glossary':
        return <Glossary />;
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
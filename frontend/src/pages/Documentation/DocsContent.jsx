import React, { createContext, useState, useEffect, useRef } from 'react';
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
  const contentRef = useRef(null);
  
  // Context value that will be available to child components
  const contextValue = {
    activeSection,
    setActiveSection
  };

  // Enhanced scroll to top when activeSection changes
  useEffect(() => {
    const scrollToTop = () => {
      // Try multiple scroll methods for better compatibility
      try {
        // Method 1: Scroll the window
        window.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Method 2: Scroll the content container if it exists
        if (contentRef.current) {
          contentRef.current.scrollTo({ top: 0, behavior: 'smooth' });
        }
        
        // Method 3: Scroll document element
        document.documentElement.scrollTo({ top: 0, behavior: 'smooth' });
        
        // Method 4: Scroll body element
        document.body.scrollTo({ top: 0, behavior: 'smooth' });
      } catch (error) {
        // Fallback to instant scroll if smooth scroll fails
        window.scrollTo(0, 0);
        if (contentRef.current) {
          contentRef.current.scrollTop = 0;
        }
        document.documentElement.scrollTop = 0;
        document.body.scrollTop = 0;
      }
    };

    // Use a small delay to ensure the component has rendered
    const timeoutId = setTimeout(scrollToTop, 100);
    
    return () => clearTimeout(timeoutId);
  }, [activeSection]);

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
      case 'editor-header': // Panel de Control Principal
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
      <div 
        ref={contentRef}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg min-h-[calc(100vh-8rem)]"
      >
        {renderContent()}
      </div>
    </DocsContext.Provider>
  );
};

export default DocsContent;
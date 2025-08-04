import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import { useNavigate } from 'react-router-dom';
import Navigation from './Home/Navegation';
import DocsSidebar from './Documentation/DocsSidebar';
import DocsContent from './Documentation/DocsContent';

export default function Documentation() {
  const navigate = useNavigate();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [activeSection, setActiveSection] = useState('introduction');
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <React.Fragment>
      <Helmet>
        <title>Documentación - Komiix | Guía Completa de Herramientas de Scanlation</title>
        <meta name="description" content="Guía completa y detallada de Komiix: herramientas profesionales para traducción y edición de manga. Aprende a usar todas las funciones, desde anotación hasta exportación final." />
        <meta name="keywords" content="komiix documentación, tutorial scanlation, traducción manga, edición manga, herramientas IA, guía completa" />
        <link rel="canonical" href="https://komiix.com/docs" />
        <meta property="og:title" content="Documentación Komiix - Guía Completa" />
        <meta property="og:description" content="Aprende a usar todas las herramientas profesionales de Komiix para scanlation de manga" />
        <meta property="og:url" content="https://komiix.com/docs" />
        <meta property="og:type" content="article" />
      </Helmet>
      
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 text-gray-900 dark:bg-gradient-to-br dark:from-gray-900 dark:to-black dark:text-white">
        <header>
          <Navigation setShowAuthModal={setShowAuthModal} />
        </header>

        <div className="pt-20">
          <div className="flex">
            {/* Mobile Sidebar Overlay */}
            {isSidebarOpen && (
              <div 
                className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            {/* Sidebar */}
            <DocsSidebar 
              activeSection={activeSection}
              setActiveSection={setActiveSection}
              isSidebarOpen={isSidebarOpen}
              setIsSidebarOpen={setIsSidebarOpen}
            />

            {/* Main Content */}
            <main className="flex-1 lg:ml-80">
              {/* Mobile Menu Button */}
              <div className="lg:hidden sticky top-20 z-30 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 p-4">
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="flex items-center space-x-2 text-gray-600 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                  <span className="font-medium">Menú de Documentación</span>
                </button>
              </div>

              {/* Content Area */}
              <div className="max-w-4xl mx-auto p-8">
                <DocsContent 
                  activeSection={activeSection} 
                  setActiveSection={setActiveSection} 
                />
              </div>
            </main>
          </div>
        </div>
      </div>
    </React.Fragment>
  );
}
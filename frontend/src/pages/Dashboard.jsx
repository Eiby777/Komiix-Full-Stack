import React, { useEffect, useState } from 'react';
import { useDashboard } from '../hooks/useDashboard';
import SettingsProfile from '../components/dashbboard/header/SettingsProfile';
import Header from '../components/dashbboard/header/Header';
import Sidebar from '../components/dashbboard/sidebar/Sidebar';
import MainContent from '../components/dashbboard/components/MainContent';
import { saveDarkTheme, getDarkTheme } from '../lib/localDB/darkDB';
import { LAYERS } from '../constants/layers';
import { useEditorStore } from '../stores/editorStore';

export default function Dashboard() {
  const { profileMenuRef, profile, handleUpdateProfile } = useDashboard();
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const [activeSection, setActiveSection] = useState('projects'); // Default to projects
  const { setActiveLayer } = useEditorStore();

  useEffect(() => {
    setActiveLayer(LAYERS.ORIGINAL.id);
  }, []);

  useEffect(() => {
    const fetchDarkTheme = async () => {
      const dark = await getDarkTheme();
      setDarkMode(dark);
    };
    fetchDarkTheme();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target)) {
        setIsProfileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [profileMenuRef]);
  const [headerHeight, setHeaderHeight] = useState(0);

  return (
    <div
      className={`${darkMode ? 'dark' : ''} min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 dark:from-blue-900 dark:to-black text-gray-900 dark:text-white transition-colors duration-300`}
    >
      <div className="flex">
        <Sidebar darkMode={darkMode} setActiveSection={setActiveSection} />

        <div className="flex-1 flex flex-col overflow-hidden">
          <Header
            isProfileMenuOpen={isProfileMenuOpen}
            setIsProfileMenuOpen={setIsProfileMenuOpen}
            profileMenuRef={profileMenuRef}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            setShowSettingsModal={setShowSettingsModal}
            onHeaderHeightChange={setHeaderHeight}
          />

          <MainContent 
            isProfileMenuOpen={isProfileMenuOpen} 
            activeSection={activeSection} 
            darkMode={darkMode}
            headerHeight={headerHeight}
          />
        </div>

        {showSettingsModal && (
          <SettingsProfile
            onClose={() => setShowSettingsModal(false)}
            initialProfile={profile}
            onSave={handleUpdateProfile}
          />
        )}
      </div>
    </div>
  );
}

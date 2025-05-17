import React, { useEffect, useRef } from 'react';
import { useDashboard } from '../../../hooks/useDashboard';
import { useAuth } from '../../../hooks/useAuth';
import { saveDarkTheme } from '../../../lib/localDB/darkDB';
export default function Header({
  isProfileMenuOpen,
  setIsProfileMenuOpen,
  profileMenuRef,
  setShowSettingsModal,
  darkMode,
  setDarkMode,
  onHeaderHeightChange
}) {
  const headerRef = useRef(null);

  useEffect(() => {
    if (headerRef.current && onHeaderHeightChange) {
      const updateHeight = () => {
        const height = headerRef.current.offsetHeight;
        onHeaderHeightChange(height);
      };
      
      updateHeight();
      window.addEventListener('resize', updateHeight);
      return () => window.removeEventListener('resize', updateHeight);
    }
  }, [onHeaderHeightChange]);
  const { 
    toggleSidebar,
    profile,
  } = useDashboard();

  const toggleTheme = () => {
    const newDarkMode = !darkMode;
    setDarkMode(newDarkMode);
    saveDarkTheme(newDarkMode);
    document.documentElement.classList.toggle("dark", newDarkMode);
  };

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  const { handleLogout } = useAuth();
  return (
    <header 
      ref={headerRef}
      className="bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-b border-gray-200/70 dark:border-gray-800/70 p-4 flex justify-end items-center gap-4 shadow-sm z-[1000]"
    >
      {/* Sidebar Toggle Button (Mobile) */}
      <button
        onClick={toggleSidebar}
        className="md:hidden p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200 group"
        aria-label="Toggle sidebar"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>

      {/* Theme Toggle Button */}
      <button
        onClick={() => {
          toggleTheme();
        }}
        className="p-2 rounded-full hover:bg-gray-200 dark:hover:bg-gray-800 transition-all duration-200 group"
        aria-label="Toggle theme"
      >
        {darkMode ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
            />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6 text-gray-600 dark:text-gray-300 group-hover:text-blue-500 dark:group-hover:text-blue-400 transition-colors duration-200"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
            />
          </svg>
        )}
      </button>

      {/* Profile Menu */}
      <div className="relative">
        <button
          onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
          className="group hover:opacity-90 transition-all duration-200"
          aria-label="Profile menu"
        >
          {profile.isLoading ? (
            <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-200 dark:bg-gray-700">
              <svg
                className="animate-spin h-6 w-6 text-blue-500"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
            </div>
          ) : (
            <img
              src={profile.picture}
              alt="User Profile"
              className="w-10 h-10 rounded-full border-2 border-gray-200 dark:border-gray-700 group-hover:border-blue-500 dark:group-hover:border-blue-400 transition-all duration-200"
            />
          )}
        </button>

        {/* Profile Dropdown */}
        {isProfileMenuOpen && (
          <div
            ref={profileMenuRef}
            className="absolute right-0 mt-3 w-56 bg-white dark:bg-gray-800 rounded-xl shadow-2xl z-[2000] border border-gray-200 dark:border-gray-700 overflow-hidden"
          >
            <button
              onClick={() => setShowSettingsModal(true)}
              className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Settings
            </button>
            <button
              onClick={handleLogout}
              className="block w-full text-left px-4 py-3 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}

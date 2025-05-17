import React from 'react';
import Projects from './projects/Projects';
import ImageMerge from './imageMerge/ImageMerge';

export default function MainContent({ isProfileMenuOpen, activeSection, darkMode, headerHeight }) {
  return (
    <div className="h-full">
      {activeSection === 'projects' && <Projects isProfileMenuOpen={isProfileMenuOpen} />}
      {activeSection === 'mergeImages' && <ImageMerge isProfileMenuOpen={isProfileMenuOpen} darkMode={darkMode} headerHeight={headerHeight} />}
    </div>
  );
}

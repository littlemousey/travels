import React, { useState, useEffect } from 'react';
import { MobileStory } from './MobileStory';
import { DesktopStory } from './DesktopStory';

export const Story: React.FC = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 1024);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  return isMobile ? <MobileStory /> : <DesktopStory />;
};

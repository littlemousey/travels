import React, { useRef, useState, useEffect } from 'react';
import styled from '@emotion/styled';
import { useChapter } from '../../context/ChapterContext';
import { StoryHeader } from './StoryHeader';
import { Chapter } from './Chapter';
import { StoryFooter } from './StoryFooter';
import { useScrollChapter } from '../../hooks/useScrollChapter';
import { theme } from '../../styles/GlobalStyles';

export const Story: React.FC = () => {
  const storyRef = useRef<HTMLDivElement>(null);
  const { chapters, currentChapterIndex, setCurrentChapterIndex } = useChapter();
  const [isMobile, setIsMobile] = useState(false);

  useScrollChapter(storyRef);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 1024);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handlePrevious = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentChapterIndex < chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
    }
  };

  if (isMobile) {
    return (
      <MobileStoryContainer>
        <ProgressBar>
          <ProgressFill progress={(currentChapterIndex + 1) / chapters.length} />
          <ProgressText>
            Chapter {currentChapterIndex + 1} of {chapters.length}
          </ProgressText>
        </ProgressBar>
        
        <MobileContent>
          <Chapter
            key={chapters[currentChapterIndex].id}
            chapter={chapters[currentChapterIndex]}
            isActive={true}
            index={currentChapterIndex}
          />
        </MobileContent>

        <NavigationButtons>
          <NavButton 
            onClick={handlePrevious} 
            disabled={currentChapterIndex === 0}
            aria-label="Previous chapter"
          >
            <ArrowIcon>←</ArrowIcon>
            <NavButtonText>Previous</NavButtonText>
          </NavButton>
          
          <NavButton 
            onClick={handleNext} 
            disabled={currentChapterIndex === chapters.length - 1}
            aria-label="Next chapter"
          >
            <NavButtonText>Next</NavButtonText>
            <ArrowIcon>→</ArrowIcon>
          </NavButton>
        </NavigationButtons>
      </MobileStoryContainer>
    );
  }

  return (
    <StoryContainer ref={storyRef}>
      <StoryHeader />
      {chapters.map((chapter, index) => (
        <Chapter
          key={chapter.id}
          chapter={chapter}
          isActive={index === currentChapterIndex}
          index={index}
        />
      ))}
      <StoryFooter />
    </StoryContainer>
  );
};

const StoryContainer = styled.div`
  width: 45%;
  height: 100vh;
  overflow-y: scroll;
  background: ${theme.colors.cream};
  position: relative;

  &::before {
    content: '';
    display: block;
    height: 4px;
    background: linear-gradient(
      90deg,
      transparent,
      ${theme.colors.gold},
      ${theme.colors.sepia},
      ${theme.colors.gold},
      transparent
    );
  }

  /* Scrollbar styling */
  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: ${theme.colors.cream};
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.lightSepia};
    border-radius: 2px;
  }
`;

const MobileStoryContainer = styled.div`
  width: 100%;
  height: 35vh;
  display: flex;
  flex-direction: column;
  background: ${theme.colors.cream};
  border-top: 3px solid ${theme.colors.gold};
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
`;

const ProgressBar = styled.div`
  position: relative;
  height: 30px;
  background: ${theme.colors.lightSepia};
  border-bottom: 1px solid ${theme.colors.sepia};
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ProgressFill = styled.div<{ progress: number }>`
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  width: ${props => props.progress * 100}%;
  background: linear-gradient(
    90deg,
    ${theme.colors.gold},
    ${theme.colors.sepia}
  );
  transition: width 0.3s ease;
`;

const ProgressText = styled.span`
  position: relative;
  z-index: 1;
  font-family: ${theme.fonts.heading};
  font-size: 0.75rem;
  font-weight: 600;
  color: ${theme.colors.ink};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const MobileContent = styled.div`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

  /* Scrollbar styling for mobile */
  &::-webkit-scrollbar {
    width: 4px;
  }

  &::-webkit-scrollbar-track {
    background: ${theme.colors.cream};
  }

  &::-webkit-scrollbar-thumb {
    background: ${theme.colors.lightSepia};
    border-radius: 2px;
  }
`;

const NavigationButtons = styled.div`
  display: flex;
  gap: 0.5rem;
  padding: 0.75rem;
  background: ${theme.colors.lightSepia};
  border-top: 1px solid ${theme.colors.sepia};
`;

const NavButton = styled.button<{ disabled?: boolean }>`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  padding: 0.75rem 1rem;
  background: ${props => props.disabled ? theme.colors.lightSepia : theme.colors.cream};
  border: 2px solid ${props => props.disabled ? theme.colors.lightSepia : theme.colors.sepia};
  border-radius: 4px;
  font-family: ${theme.fonts.heading};
  font-size: 0.95rem;
  font-weight: 600;
  color: ${props => props.disabled ? theme.colors.muted : theme.colors.ink};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  opacity: ${props => props.disabled ? 0.5 : 1};

  &:active:not(:disabled) {
    transform: translateY(1px);
    background: ${theme.colors.gold};
  }

  @media (hover: hover) {
    &:hover:not(:disabled) {
      background: ${theme.colors.gold};
      border-color: ${theme.colors.gold};
    }
  }
`;

const NavButtonText = styled.span`
  text-transform: uppercase;
  letter-spacing: 0.05em;
`;

const ArrowIcon = styled.span`
  font-size: 1.2rem;
  line-height: 1;
`;

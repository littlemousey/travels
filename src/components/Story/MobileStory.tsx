import React, { useRef } from 'react';
import styled from '@emotion/styled';
import { useChapter } from '../../context/ChapterContext';
import { Chapter } from './Chapter';
import { theme } from '../../styles/GlobalStyles';

export const MobileStory: React.FC = () => {
  const { chapters, currentChapterIndex, setCurrentChapterIndex } = useChapter();
  const touchStartX = useRef<number>(0);
  const touchStartY = useRef<number>(0);

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

  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    const deltaX = touchStartX.current - e.changedTouches[0].clientX;
    const deltaY = Math.abs(touchStartY.current - e.changedTouches[0].clientY);
    if (Math.abs(deltaX) > 50 && deltaY < 80) {
      if (deltaX > 0) handleNext();
      else handlePrevious();
    }
  };

  return (
    <MobileStoryContainer
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
    >
      <MobileNavBar>
        <NavButton
          onClick={handlePrevious}
          disabled={currentChapterIndex === 0}
          aria-label="Vorig hoofdstuk"
        >
          ←
        </NavButton>
        <ProgressInfo>
          <ProgressFill progress={(currentChapterIndex + 1) / chapters.length} />
          <ProgressText>
            {currentChapterIndex + 1} / {chapters.length}
          </ProgressText>
        </ProgressInfo>
        <NavButton
          onClick={handleNext}
          disabled={currentChapterIndex === chapters.length - 1}
          aria-label="Volgend hoofdstuk"
        >
          →
        </NavButton>
      </MobileNavBar>

      <MobileContent>
        <Chapter
          key={chapters[currentChapterIndex].id}
          chapter={chapters[currentChapterIndex]}
          isActive={true}
          index={currentChapterIndex}
        />
      </MobileContent>
    </MobileStoryContainer>
  );
};

const MobileStoryContainer = styled.div`
  width: 100%;
  flex: 1;
  min-height: 0;
  display: flex;
  flex-direction: column;
  background: ${theme.colors.cream};
  border-top: 3px solid ${theme.colors.gold};
  box-shadow: 0 -4px 20px rgba(0, 0, 0, 0.15);
`;

const MobileNavBar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.4rem 0.75rem;
  background: ${theme.colors.lightSepia};
  border-bottom: 1px solid ${theme.colors.sepia};
  flex-shrink: 0;
`;

const ProgressInfo = styled.div`
  position: relative;
  flex: 1;
  height: 28px;
  background: rgba(0, 0, 0, 0.08);
  border-radius: 14px;
  overflow: hidden;
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
  border-radius: 14px;
`;

const ProgressText = styled.span`
  position: relative;
  z-index: 1;
  font-family: ${theme.fonts.heading};
  font-size: 0.75rem;
  font-weight: 600;
  color: ${theme.colors.ink};
  letter-spacing: 0.05em;
`;

const MobileContent = styled.div`
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;

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

const NavButton = styled.button<{ disabled?: boolean }>`
  width: 36px;
  height: 36px;
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${props => props.disabled ? 'transparent' : theme.colors.cream};
  border: 2px solid ${props => props.disabled ? 'transparent' : theme.colors.sepia};
  border-radius: 50%;
  font-size: 1.1rem;
  color: ${props => props.disabled ? theme.colors.muted : theme.colors.ink};
  cursor: ${props => props.disabled ? 'not-allowed' : 'pointer'};
  transition: all 0.2s ease;
  opacity: ${props => props.disabled ? 0.3 : 1};
  padding: 0;

  &:active:not([disabled]) {
    transform: scale(0.9);
    background: ${theme.colors.gold};
    border-color: ${theme.colors.gold};
  }

  @media (hover: hover) {
    &:hover:not([disabled]) {
      background: ${theme.colors.gold};
      border-color: ${theme.colors.gold};
    }
  }
`;

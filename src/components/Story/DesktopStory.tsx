import React, { useRef } from 'react';
import styled from '@emotion/styled';
import { useChapter } from '../../context/ChapterContext';
import { StoryHeader } from './StoryHeader';
import { Chapter } from './Chapter';
import { StoryFooter } from './StoryFooter';
import { useScrollChapter } from '../../hooks/useScrollChapter';
import { theme } from '../../styles/GlobalStyles';

export const DesktopStory: React.FC = () => {
  const storyRef = useRef<HTMLDivElement>(null);
  const { chapters, currentChapterIndex } = useChapter();

  useScrollChapter(storyRef);

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
  height: 100%;
  overflow-y: scroll;
  padding-bottom: 3rem;
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

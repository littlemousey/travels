import React from 'react';
import styled from '@emotion/styled';
import { Chapter as ChapterType } from '../../types';
import { theme } from '../../styles/GlobalStyles';
import { useChapter } from '../../context/ChapterContext';

interface ChapterProps {
  chapter: ChapterType;
  isActive: boolean;
  index: number;
}

export const Chapter: React.FC<ChapterProps> = ({ chapter, isActive, index }) => {
  const { setCurrentChapterIndex } = useChapter();

  const handleClick = () => {
    setCurrentChapterIndex(index);
    
    // Scroll the chapter into view
    const chapterElement = document.querySelector(`[data-chapter-index="${index}"]`);
    if (chapterElement) {
      chapterElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <ChapterCard isActive={isActive} isMilestone={chapter.category === 'milestone'} data-chapter-index={index} onClick={handleClick}>
      {chapter.category === 'milestone' && (
        <MilestoneBadge>
          <BadgeIcon>✦</BadgeIcon>
          <BadgeText>Mijlpaal</BadgeText>
        </MilestoneBadge>
      )}
      <ChapterMeta>
        <ChapterYear>{chapter.year}</ChapterYear>
        <div>
          <ChapterPeriod>{chapter.period}</ChapterPeriod>
        </div>
        {chapter.category === 'milestone' && chapter.milestoneIcon ? (
          <MilestoneIcon>{chapter.milestoneIcon}</MilestoneIcon>
        ) : (
          <ChapterFlag>{chapter.flag}</ChapterFlag>
        )}
      </ChapterMeta>
      <ChapterHeading>{chapter.heading}</ChapterHeading>
      <LocationTag isMilestone={chapter.category === 'milestone'}>{chapter.locationTag}</LocationTag>
      <ChapterContent>
        {chapter.content.split('—').map((part, i, arr) => {
          if (i === 0) return part;
          if (i === arr.length - 1) return <span key={i}> — {part}</span>;
          return <span key={i}> — {part}</span>;
        })}
      </ChapterContent>
      {chapter.stops && (
        <StopsList>
          {chapter.stops.map((stop, i) => (
            <StopPill key={i}>{stop}</StopPill>
          ))}
        </StopsList>
      )}
    </ChapterCard>
  );
};

const ChapterCard = styled.div<{ isActive: boolean; isMilestone?: boolean }>`
  padding: 3.5rem 3rem;
  border-bottom: 1px solid ${theme.colors.lightSepia};
  transition: all 0.4s ease;
  position: relative;
  cursor: pointer;
  background: ${(props) => {
    if (props.isMilestone) {
      return props.isActive ? 'rgba(139, 111, 71, 0.08)' : 'rgba(139, 111, 71, 0.02)';
    }
    return props.isActive ? 'rgba(201, 168, 76, 0.06)' : 'transparent';
  }};

  &:hover {
    background: ${(props) => {
      if (props.isMilestone) {
        return props.isActive ? 'rgba(139, 111, 71, 0.12)' : 'rgba(139, 111, 71, 0.05)';
      }
      return props.isActive ? 'rgba(201, 168, 76, 0.08)' : 'rgba(201, 168, 76, 0.03)';
    }};
  }

  &::before {
    content: '';
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 3px;
    background: ${(props) => {
      if (props.isMilestone) {
        return props.isActive
          ? `linear-gradient(to bottom, ${theme.colors.sepia}, ${theme.colors.gold})`
          : 'transparent';
      }
      return props.isActive
        ? `linear-gradient(to bottom, ${theme.colors.gold}, ${theme.colors.sepia})`
        : 'transparent';
    }};
    transition: background 0.4s ease;
  }

  @media (max-width: 1024px) {
    padding: 2rem 1.5rem;
    border-bottom: none;
  }
`;

const MilestoneBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: ${theme.colors.sepia};
  color: ${theme.colors.cream};
  padding: 0.35rem 0.85rem;
  border-radius: 2px;
  font-size: 0.65rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  font-family: ${theme.fonts.body};
  font-weight: 600;
  margin-bottom: 1rem;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.15);
`;

const BadgeIcon = styled.span`
  font-size: 0.7rem;
`;

const BadgeText = styled.span`
  line-height: 1;
`;

const MilestoneIcon = styled.span`
  font-size: 1.8rem;
  margin-left: auto;
  filter: drop-shadow(0 1px 3px rgba(0, 0, 0, 0.1));
`;

const ChapterMeta = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.2rem;
`;

const ChapterYear = styled.span`
  font-family: ${theme.fonts.heading};
  font-size: 1.8rem;
  font-weight: 700;
  color: ${theme.colors.gold};
  line-height: 1;
`;

const ChapterPeriod = styled.div`
  font-size: 0.72rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: ${theme.colors.muted};
  font-family: ${theme.fonts.body};
`;

const ChapterFlag = styled.span`
  font-size: 1.4rem;
  margin-left: auto;
`;

const ChapterHeading = styled.h2`
  font-family: ${theme.fonts.heading};
  font-size: 1.5rem;
  font-weight: 400;
  color: ${theme.colors.ink};
  margin-bottom: 0.5rem;
  line-height: 1.3;
`;

const LocationTag = styled.div<{ isMilestone?: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.75rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: ${(props) => props.isMilestone ? theme.colors.sepia : theme.colors.accent};
  margin-bottom: 1.2rem;
  font-family: ${theme.fonts.body};
  font-weight: ${(props) => props.isMilestone ? '600' : '400'};

  &::before {
    content: ${(props) => props.isMilestone ? "'✦'" : "'◈'"};
    color: ${(props) => props.isMilestone ? theme.colors.sepia : theme.colors.gold};
  }
`;

const ChapterContent = styled.p`
  font-size: 1.05rem;
  line-height: 1.85;
  color: ${theme.colors.ink};
  font-weight: 300;

  em {
    font-style: italic;
    color: ${theme.colors.sepia};
  }
`;

const StopsList = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
`;

const StopPill = styled.span`
  background: ${theme.colors.lightSepia};
  border: 1px solid rgba(139, 111, 71, 0.2);
  border-radius: 2px;
  padding: 0.25rem 0.7rem;
  font-size: 0.75rem;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: ${theme.colors.muted};
  font-family: ${theme.fonts.body};
`;

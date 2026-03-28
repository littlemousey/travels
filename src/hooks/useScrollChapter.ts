import { useEffect, RefObject } from 'react';
import { useChapter } from '../context/ChapterContext';

export const useScrollChapter = (storyRef: RefObject<HTMLDivElement>) => {
  const { currentChapterIndex, setCurrentChapterIndex, chapters } = useChapter();

  useEffect(() => {
    const storyEl = storyRef.current;
    if (!storyEl) return;

    const handleScroll = () => {
      const scrollTop = storyEl.scrollTop;

      // Skip header section
      const header = storyEl.querySelector('.story-header') as HTMLElement;
      if (header) {
        const headerBottom = header.offsetTop + header.offsetHeight;

        if (scrollTop < headerBottom - 100) {
          // In the header — show first chapter
          if (currentChapterIndex !== 0) {
            setCurrentChapterIndex(0);
          }
          return;
        }
      }

      // Find which chapter is most in view
      const chapterElements = storyEl.querySelectorAll('[data-chapter-index]');
      let bestIndex = 0;
      let bestVis = -1;

      chapterElements.forEach((el, i) => {
        const rect = el.getBoundingClientRect();
        const storyRect = storyEl.getBoundingClientRect();
        const top = rect.top - storyRect.top;
        const bottom = rect.bottom - storyRect.top;
        const vis = Math.min(bottom, storyRect.height) - Math.max(top, 0);
        
        if (vis > bestVis) {
          bestVis = vis;
          bestIndex = i;
        }
      });

      if (bestIndex !== currentChapterIndex) {
        setCurrentChapterIndex(bestIndex);
      }
    };

    storyEl.addEventListener('scroll', handleScroll);
    return () => {
      storyEl.removeEventListener('scroll', handleScroll);
    };
  }, [storyRef, currentChapterIndex, setCurrentChapterIndex, chapters]);
};

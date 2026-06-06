import { useEffect, useRef, RefObject } from 'react';
import { useChapter } from '../context/ChapterContext';

// Module-level lock so Chapter.tsx can block the scroll handler during
// programmatic smooth-scrolls (which fire intermediate scroll events).
let scrollLocked = false;
let lockTimer: ReturnType<typeof setTimeout> | null = null;

export const lockScrollChapter = (ms = 900) => {
  scrollLocked = true;
  if (lockTimer) clearTimeout(lockTimer);
  lockTimer = setTimeout(() => {
    scrollLocked = false;
    lockTimer = null;
  }, ms);
};

export const useScrollChapter = (storyRef: RefObject<HTMLDivElement>) => {
  const { currentChapterIndex, setCurrentChapterIndex, chapters } = useChapter();
  const currentChapterIndexRef = useRef(currentChapterIndex);
  currentChapterIndexRef.current = currentChapterIndex;

  useEffect(() => {
    const storyEl = storyRef.current;
    if (!storyEl) return;

    const handleScroll = () => {
      if (scrollLocked) return;

      const scrollTop = storyEl.scrollTop;

      // Skip header section
      const header = storyEl.querySelector('.story-header') as HTMLElement;
      if (header) {
        const headerBottom = header.offsetTop + header.offsetHeight;

        if (scrollTop < headerBottom - 100) {
          if (currentChapterIndexRef.current !== 0) {
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

      if (bestIndex !== currentChapterIndexRef.current) {
        setCurrentChapterIndex(bestIndex);
      }
    };

    storyEl.addEventListener('scroll', handleScroll);
    return () => storyEl.removeEventListener('scroll', handleScroll);
  }, [storyRef, setCurrentChapterIndex, chapters]);
};

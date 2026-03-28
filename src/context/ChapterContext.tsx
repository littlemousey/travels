import React, { createContext, useContext, useState, ReactNode } from 'react';
import { ChapterContextType } from '../types';
import { chapters } from '../data/chapters';
import { markers } from '../data/markers';

const ChapterContext = createContext<ChapterContextType | undefined>(undefined);

interface ChapterProviderProps {
  children: ReactNode;
}

export const ChapterProvider: React.FC<ChapterProviderProps> = ({ children }) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);

  return (
    <ChapterContext.Provider
      value={{
        currentChapterIndex,
        setCurrentChapterIndex,
        chapters,
        markers,
      }}
    >
      {children}
    </ChapterContext.Provider>
  );
};

export const useChapter = (): ChapterContextType => {
  const context = useContext(ChapterContext);
  if (!context) {
    throw new Error('useChapter must be used within a ChapterProvider');
  }
  return context;
};

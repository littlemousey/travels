import React from 'react';
import { ChapterProvider } from './context/ChapterContext';
import { GlobalStyles } from './styles/GlobalStyles';
import { TravelMemories } from './components/Layout/TravelMemories';

const App: React.FC = () => {
  return (
    <ChapterProvider>
      <GlobalStyles />
      <TravelMemories />
    </ChapterProvider>
  );
};

export default App;

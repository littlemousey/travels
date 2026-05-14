import React, { useState } from 'react';
import styled from '@emotion/styled';
import { ChapterProvider } from './context/ChapterContext';
import { GlobalStyles, theme } from './styles/GlobalStyles';
import { TravelMemories } from './components/Layout/TravelMemories';
import { LocationOverview } from './components/Map/LocationOverview';

type TabType = 'stories' | 'overview';

const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('stories');

  return (
    <ChapterProvider>
      <GlobalStyles />
      <AppContainer>
        <TabNavigation>
          <TabButton 
            active={activeTab === 'stories'} 
            onClick={() => setActiveTab('stories')}
          >
            Reisverhalen
          </TabButton>
          <TabButton 
            active={activeTab === 'overview'} 
            onClick={() => setActiveTab('overview')}
          >
            Overzicht locaties
          </TabButton>
        </TabNavigation>
        <TabContent>
          {activeTab === 'stories' ? <TravelMemories /> : <LocationOverview />}
        </TabContent>
      </AppContainer>
    </ChapterProvider>
  );
};

const AppContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100vh;
  overflow: hidden;
`;

const TabNavigation = styled.nav`
  display: flex;
  background: ${theme.colors.navyDark};
  border-bottom: 2px solid ${theme.colors.gold}44;
  padding: 0;
  gap: 0;
`;

const TabButton = styled.button<{ active: boolean }>`
  flex: 0 0 auto;
  padding: 1.25rem 2.5rem;
  font-family: ${theme.fonts.heading};
  font-size: 1.1rem;
  font-weight: ${({ active }) => (active ? '400' : '300')};
  letter-spacing: 1.5px;
  color: ${({ active }) => (active ? theme.colors.cream : theme.colors.gold)};
  background: ${({ active }) => (active ? theme.colors.navy : 'transparent')};
  border: none;
  border-bottom: 3px solid ${({ active }) => (active ? theme.colors.gold : 'transparent')};
  cursor: pointer;
  transition: all 0.3s ease;
  position: relative;
  
  &:hover {
    background: ${({ active }) => (active ? theme.colors.navy : theme.colors.navy + '88')};
    color: ${theme.colors.cream};
  }
  
  &:focus {
    outline: none;
  }
  
  @media (max-width: 768px) {
    flex: 1;
    padding: 1rem 1.5rem;
    font-size: 1rem;
  }
`;

const TabContent = styled.div`
  flex: 1;
  overflow: hidden;
`;

export default App;

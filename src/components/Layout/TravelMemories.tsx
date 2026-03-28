import React from 'react';
import styled from '@emotion/styled';
import { Map } from '../Map/Map';
import { Story } from '../Story/Story';

export const TravelMemories: React.FC = () => {
  return (
    <Container>
      <Map />
      <Story />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    overflow: auto;
    height: auto;
  }
`;

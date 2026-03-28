import styled from '@emotion/styled';
import { theme } from '../../styles/GlobalStyles';

export const MapOverlay = () => {
  return (
    <Overlay>
      <Vignette />
      <TitleBadge>
        <Title>Ans' Reisherinneringen</Title>
        <Subtitle>1991 — 1993</Subtitle>
      </TitleBadge>
    </Overlay>
  );
};

const Overlay = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  pointer-events: none;
`;

const Vignette = styled.div`
  position: absolute;
  inset: 0;
  background: radial-gradient(
    ellipse at center,
    transparent 60%,
    rgba(26, 22, 18, 0.25) 100%
  );
  pointer-events: none;
  z-index: 1;
`;

const TitleBadge = styled.div`
  position: absolute;
  top: 2rem;
  left: 50%;
  transform: translateX(-50%);
  z-index: 2;
  pointer-events: none;
  text-align: center;
`;

const Title = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: 1.1rem;
  font-weight: 400;
  letter-spacing: 0.25em;
  text-transform: uppercase;
  color: ${theme.colors.cream};
  text-shadow: 0 1px 8px rgba(0, 0, 0, 0.6);
`;

const Subtitle = styled.div`
  font-family: ${theme.fonts.body};
  font-style: italic;
  font-size: 0.85rem;
  color: rgba(245, 240, 232, 0.8);
  letter-spacing: 0.1em;
  text-shadow: 0 1px 6px rgba(0, 0, 0, 0.5);
`;

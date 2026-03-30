import styled from '@emotion/styled';
import { theme } from '../../styles/GlobalStyles';

export const StoryHeader = () => {
  return (
    <Header className="story-header">
      <Eyebrow>Mijn leven tot nu toe in kaart</Eyebrow>
      <Title>
        Mijn <em>35 jarige</em>
        <br />
        reis
      </Title>
      <Intro>
        Al van jongs af aan heb ik veel mooie plekken bezocht.
        Misschien is daardoor mijn reislust ontstaan.
        Het leek mij leuk om een overzicht te krijgen van waar op de wereld ik geweest ben.
        Scroll door de reis van mijn leven.
        Om het overzicht een beetje te bewaren heb ik voor het gemak wat steden (vooral binnen Nederland) weggelaten.
      </Intro>
    </Header>
  );
};

const Header = styled.div`
  padding: 4rem 3rem 3rem;
  border-bottom: 1px solid ${theme.colors.lightSepia};
  text-align: center;
  position: relative;

  &::after {
    content: '✦';
    display: block;
    color: ${theme.colors.gold};
    font-size: 1.2rem;
    margin-top: 2rem;
  }
`;

const Eyebrow = styled.div`
  font-family: ${theme.fonts.body};
  font-size: 0.75rem;
  letter-spacing: 0.3em;
  text-transform: uppercase;
  color: ${theme.colors.sepia};
  margin-bottom: 1rem;
`;

const Title = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: 2.6rem;
  font-weight: 400;
  line-height: 1.2;
  color: ${theme.colors.ink};
  margin-bottom: 0.5rem;

  em {
    font-style: italic;
    color: ${theme.colors.sepia};
  }
`;

const Intro = styled.p`
  font-size: 1.1rem;
  color: ${theme.colors.muted};
  font-style: italic;
  line-height: 1.7;
  max-width: 340px;
  margin: 1.5rem auto 0;
`;

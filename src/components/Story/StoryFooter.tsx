import styled from '@emotion/styled';
import { theme } from '../../styles/GlobalStyles';

export const StoryFooter = () => {
  return (
    <Footer>
      <Ornament>✦ ◆ ✦</Ornament>
      <Text>
        Dit zijn slechts de eerste stappen
        <br />
        van een leven vol ontdekkingen.
        <br />
        <em>Het verhaal gaat nog steeds verder.</em>
      </Text>
    </Footer>
  );
};

const Footer = styled.div`
  padding: 4rem 3rem;
  text-align: center;
`;

const Ornament = styled.span`
  color: ${theme.colors.gold};
  font-size: 1.5rem;
  letter-spacing: 0.5em;
  display: block;
  margin-bottom: 2rem;
`;

const Text = styled.p`
  font-style: italic;
  color: ${theme.colors.muted};
  font-size: 1rem;
  line-height: 1.8;
`;

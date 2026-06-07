import React, { useState } from 'react';
import styled from '@emotion/styled';
import { chapters } from '../../data/chapters';
import { Chapter } from '../../types';
import { theme } from '../../styles/GlobalStyles';

type Continent = 'Europa' | 'Afrika' | 'Noord-Amerika' | 'Latijns-Amerika' | 'Azië';

const CONTINENT_CONFIG: Record<Continent, { color: string; bg: string; emoji: string }> = {
  Europa:           { color: '#fff', bg: theme.colors.navy,    emoji: '🌍' },
  Afrika:           { color: '#fff', bg: '#9a5c1a',             emoji: '🌍' },
  'Noord-Amerika':  { color: '#fff', bg: '#1a5276',             emoji: '🌎' },
  'Latijns-Amerika':{ color: '#fff', bg: '#7b241c',             emoji: '🌎' },
  Azië:             { color: '#fff', bg: theme.colors.accent,   emoji: '🌏' },
};

const CONTINENT_ORDER: Continent[] = ['Europa', 'Afrika', 'Noord-Amerika', 'Latijns-Amerika', 'Azië'];

// Pure life milestones (no travel) – excluded from this view
const EXCLUDE_IDS = new Set([
  'geboorte', 'maarssen', 'palet', 'deklop', 'rietveld',
  'universiteit', 'uva', 'eerste-baan', 'vleuten', 'maarssenbroek',
]);

// Continent mapping for non-European chapters
// A chapter can belong to multiple continents (e.g. marbella = Europe + Africa)
const CONTINENT_OVERRIDES: Record<string, Continent[]> = {
  marbella:           ['Europa', 'Afrika'],
  hawaii:             ['Noord-Amerika'],
  'florida-newyork':  ['Noord-Amerika'],
  mexico:             ['Latijns-Amerika'],
  japan2010:          ['Azië'],
  wuhan2012:          ['Azië'],
  beijing2012:        ['Azië'],
  azie2013:           ['Azië'],
  rusland2011:        ['Europa'],
  korea2017:          ['Azië'],
  canada2019:         ['Noord-Amerika'],
  taiwan2026:         ['Azië'],
};

function getContinents(ch: Chapter): Continent[] {
  return CONTINENT_OVERRIDES[ch.id] ?? ['Europa'];
}

interface DecadeConfig {
  label: string;
  yearStart: number;
  yearEnd: number;
  lifePhase: string;
  ageRange: string;
  icon: string;
}

const DECADES: DecadeConfig[] = [
  { label: "De jaren '90", yearStart: 1991, yearEnd: 1999, lifePhase: 'Kind',           ageRange: '0–8 jaar',   icon: '👶' },
  { label: "De jaren '00", yearStart: 2000, yearEnd: 2009, lifePhase: 'Kind & Tiener', ageRange: '8–18 jaar',  icon: '🧒' },
  { label: "De jaren '10", yearStart: 2010, yearEnd: 2019, lifePhase: 'Jongvolwassene', ageRange: '18–28 jaar', icon: '🎓' },
  { label: "De jaren '20", yearStart: 2020, yearEnd: 2026, lifePhase: 'Volwassene',     ageRange: '28–35 jaar', icon: '🏡' },
];

export const DecadeOverview: React.FC = () => {
  const [expandedDecade, setExpandedDecade] = useState<string | null>(null);

  const travelChapters = chapters.filter(ch => !EXCLUDE_IDS.has(ch.id));

  const decadeData = DECADES.map(decade => {
    const decadeChapters = travelChapters.filter(ch => {
      const year = parseInt(ch.year);
      return !isNaN(year) && year >= decade.yearStart && year <= decade.yearEnd;
    });

    const continentMap = new Map<Continent, number>();
    decadeChapters.forEach(ch => {
      getContinents(ch).forEach(c => {
        continentMap.set(c, (continentMap.get(c) ?? 0) + 1);
      });
    });

    return { ...decade, chapters: decadeChapters, continentMap };
  });

  return (
    <Container>
      <PageHeader>
        <PageTitle>Reizen per decennium</PageTitle>
        <PageSubtitle>Welke continenten bezocht in elk deel van mijn leven</PageSubtitle>
      </PageHeader>

      {/* Summary table */}
      <TableWrapper>
        <Table>
          <thead>
            <tr>
              <Th align="left">Periode</Th>
              <Th align="left">Levensfase</Th>
              {CONTINENT_ORDER.map(c => (
                <Th key={c} align="center">
                  <div>{CONTINENT_CONFIG[c].emoji}</div>
                  <ThLabel>{c}</ThLabel>
                </Th>
              ))}
              <Th align="center">Reizen</Th>
            </tr>
          </thead>
          <tbody>
            {decadeData.map((decade, i) => (
              <TableRow
                key={decade.label}
                isLast={i === decadeData.length - 1}
                onClick={() => setExpandedDecade(expandedDecade === decade.label ? null : decade.label)}
              >
                <Td align="left">
                  <DecadeCellLabel>
                    <span style={{ fontSize: '1.2rem' }}>{decade.icon}</span>
                    <div>
                      <div style={{ fontWeight: 600 }}>{decade.label}</div>
                      <YearRange>{decade.yearStart}–{decade.yearEnd}</YearRange>
                    </div>
                  </DecadeCellLabel>
                </Td>
                <Td align="left">
                  <PhaseCell>
                    <PhaseName>{decade.lifePhase}</PhaseName>
                    <AgeRange>{decade.ageRange}</AgeRange>
                  </PhaseCell>
                </Td>
                {CONTINENT_ORDER.map(continent => (
                  <Td key={continent} align="center">
                    {decade.continentMap.has(continent) ? (
                      <ContinentDot bg={CONTINENT_CONFIG[continent].bg}>
                        {decade.continentMap.get(continent)}
                      </ContinentDot>
                    ) : (
                      <EmptyCell>—</EmptyCell>
                    )}
                  </Td>
                ))}
                <Td align="center">
                  <TotalCount>{decade.chapters.length}</TotalCount>
                </Td>
              </TableRow>
            ))}
          </tbody>
        </Table>
        <TableNote>Klik op een rij voor de gedetailleerde reislijst. Cijfers geven het aantal reizen per continent aan.</TableNote>
      </TableWrapper>

      {/* Decade detail cards */}
      {decadeData.map(decade => {
        const isOpen = expandedDecade === decade.label;
        return (
          <DecadeSection key={decade.label}>
            <DecadeHeader onClick={() => setExpandedDecade(isOpen ? null : decade.label)}>
              <DecadeIconWrap>{decade.icon}</DecadeIconWrap>
              <DecadeInfo>
                <DecadeTitle>
                  {decade.label}
                  <DecadeYears>{decade.yearStart}–{decade.yearEnd}</DecadeYears>
                </DecadeTitle>
                <DecadePhase>{decade.lifePhase} · {decade.ageRange}</DecadePhase>
              </DecadeInfo>
              <DecadeRight>
                <ContinentPills>
                  {CONTINENT_ORDER.filter(c => decade.continentMap.has(c)).map(c => (
                    <ContinentPill key={c} bg={CONTINENT_CONFIG[c].bg}>
                      {CONTINENT_CONFIG[c].emoji} {c}
                    </ContinentPill>
                  ))}
                </ContinentPills>
                <ToggleBtn isOpen={isOpen}>
                  {decade.chapters.length} reizen {isOpen ? '▲' : '▼'}
                </ToggleBtn>
              </DecadeRight>
            </DecadeHeader>

            {isOpen && (
              <TripGrid>
                {decade.chapters.map(ch => (
                  <TripCard key={ch.id} isMilestone={ch.category === 'milestone'}>
                    <TripCardTop>
                      <TripYear>{ch.year}</TripYear>
                      <TripFlag>{ch.flag}</TripFlag>
                    </TripCardTop>
                    <TripHeading>{ch.heading}</TripHeading>
                    <TripLocation>{ch.locationTag}</TripLocation>
                    {ch.category === 'milestone' && ch.milestoneIcon && (
                      <MilestoneBadge>{ch.milestoneIcon} Mijlpaal</MilestoneBadge>
                    )}
                  </TripCard>
                ))}
              </TripGrid>
            )}
          </DecadeSection>
        );
      })}
    </Container>
  );
};

// ─── Styled components ───────────────────────────────────────────────────────

const Container = styled.div`
  height: 100%;
  overflow-y: auto;
  background: ${theme.colors.cream};
  padding: 2rem;

  @media (max-width: 768px) {
    padding: 1rem;
  }
`;

const PageHeader = styled.div`
  margin-bottom: 2rem;
  border-bottom: 2px solid ${theme.colors.gold}44;
  padding-bottom: 1.5rem;
`;

const PageTitle = styled.h1`
  font-family: ${theme.fonts.heading};
  font-size: 2rem;
  font-weight: 400;
  color: ${theme.colors.ink};
  letter-spacing: 1px;
  margin-bottom: 0.4rem;

  @media (max-width: 768px) {
    font-size: 1.5rem;
  }
`;

const PageSubtitle = styled.p`
  font-family: ${theme.fonts.body};
  font-size: 1.1rem;
  color: ${theme.colors.muted};
  font-style: italic;
`;

// ─── Summary table ────────────────────────────────────────────────────────────

const TableWrapper = styled.div`
  overflow-x: auto;
  margin-bottom: 2.5rem;
  border: 1px solid ${theme.colors.lightSepia};
  border-radius: 4px;

  @media (max-width: 640px) {
    display: none;
  }
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  font-family: ${theme.fonts.body};
  font-size: 1rem;
  background: #fff;
  min-width: 640px;
`;

const Th = styled.th<{ align?: string }>`
  padding: 0.75rem 1rem;
  text-align: ${({ align }) => align ?? 'left'};
  font-family: ${theme.fonts.heading};
  font-size: 0.8rem;
  font-weight: 400;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: ${theme.colors.muted};
  background: ${theme.colors.navyDark};
  color: ${theme.colors.gold};
  border-bottom: 2px solid ${theme.colors.gold}44;
  white-space: nowrap;
`;

const ThLabel = styled.div`
  font-size: 0.7rem;
  margin-top: 2px;
`;

const TableRow = styled.tr<{ isLast: boolean }>`
  cursor: pointer;
  border-bottom: ${({ isLast }) => isLast ? 'none' : `1px solid ${theme.colors.lightSepia}`};
  transition: background 0.15s;

  &:hover {
    background: ${theme.colors.lightSepia}66;
  }
`;

const Td = styled.td<{ align?: string }>`
  padding: 0.8rem 1rem;
  text-align: ${({ align }) => align ?? 'left'};
  vertical-align: middle;
  color: ${theme.colors.ink};
  font-size: 1rem;
`;

const DecadeCellLabel = styled.div`
  display: flex;
  align-items: center;
  gap: 0.6rem;
`;

const YearRange = styled.div`
  font-size: 0.85rem;
  color: ${theme.colors.muted};
`;

const PhaseCell = styled.div``;

const PhaseName = styled.div`
  font-weight: 600;
  color: ${theme.colors.ink};
`;

const AgeRange = styled.div`
  font-size: 0.85rem;
  color: ${theme.colors.muted};
`;

const ContinentDot = styled.div<{ bg: string }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 50%;
  background: ${({ bg }) => bg};
  color: #fff;
  font-size: 0.85rem;
  font-weight: 600;
  font-family: ${theme.fonts.heading};
`;

const EmptyCell = styled.span`
  color: ${theme.colors.lightSepia};
  font-size: 1rem;
`;

const TotalCount = styled.span`
  font-family: ${theme.fonts.heading};
  font-size: 1.1rem;
  font-weight: 600;
  color: ${theme.colors.ink};
`;

const TableNote = styled.p`
  padding: 0.6rem 1rem;
  font-size: 0.8rem;
  color: ${theme.colors.muted};
  font-style: italic;
  font-family: ${theme.fonts.body};
  background: ${theme.colors.cream};
  border-top: 1px solid ${theme.colors.lightSepia};
`;

// ─── Decade sections ─────────────────────────────────────────────────────────

const DecadeSection = styled.div`
  background: #fff;
  border: 1px solid ${theme.colors.lightSepia};
  border-radius: 4px;
  margin-bottom: 1rem;
  overflow: hidden;
`;

const DecadeHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
  cursor: pointer;
  background: ${theme.colors.navyDark};
  color: ${theme.colors.cream};
  transition: background 0.15s;

  &:hover {
    background: ${theme.colors.navy};
  }

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }
`;

const DecadeIconWrap = styled.div`
  font-size: 1.8rem;
  flex-shrink: 0;
`;

const DecadeInfo = styled.div`
  flex: 1;
  min-width: 0;
`;

const DecadeTitle = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: 1.2rem;
  font-weight: 400;
  display: flex;
  align-items: baseline;
  gap: 0.6rem;
`;

const DecadeYears = styled.span`
  font-size: 0.9rem;
  color: ${theme.colors.gold};
  font-style: normal;
`;

const DecadePhase = styled.div`
  font-size: 0.9rem;
  color: ${theme.colors.gold}cc;
  margin-top: 0.15rem;
  font-style: italic;
`;

const DecadeRight = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.5rem;

  @media (max-width: 768px) {
    align-items: flex-start;
    width: 100%;
  }
`;

const ContinentPills = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  justify-content: flex-end;

  @media (max-width: 768px) {
    justify-content: flex-start;
  }
`;

const ContinentPill = styled.span<{ bg: string }>`
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  background: ${({ bg }) => bg};
  color: #fff;
  font-size: 0.75rem;
  font-family: ${theme.fonts.body};
  white-space: nowrap;
`;

const ToggleBtn = styled.div<{ isOpen: boolean }>`
  font-size: 0.85rem;
  color: ${theme.colors.gold};
  font-family: ${theme.fonts.body};
  white-space: nowrap;
`;

// ─── Trip grid ────────────────────────────────────────────────────────────────

const TripGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 0;
  border-top: 1px solid ${theme.colors.lightSepia};

  @media (max-width: 480px) {
    grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  }
`;

const TripCard = styled.div<{ isMilestone: boolean }>`
  padding: 0.85rem 1rem;
  border-right: 1px solid ${theme.colors.lightSepia};
  border-bottom: 1px solid ${theme.colors.lightSepia};
  background: ${({ isMilestone }) => isMilestone ? theme.colors.cream : '#fff'};
  transition: background 0.15s;

  &:hover {
    background: ${theme.colors.lightSepia}55;
  }
`;

const TripCardTop = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.3rem;
`;

const TripYear = styled.span`
  font-size: 0.75rem;
  color: ${theme.colors.muted};
  font-family: ${theme.fonts.heading};
  letter-spacing: 0.5px;
`;

const TripFlag = styled.span`
  font-size: 1rem;
`;

const TripHeading = styled.div`
  font-family: ${theme.fonts.heading};
  font-size: 0.95rem;
  color: ${theme.colors.ink};
  font-weight: 400;
  line-height: 1.3;
  margin-bottom: 0.2rem;
`;

const TripLocation = styled.div`
  font-size: 0.8rem;
  color: ${theme.colors.muted};
  font-style: italic;
  line-height: 1.3;
`;

const MilestoneBadge = styled.div`
  margin-top: 0.4rem;
  display: inline-flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.7rem;
  color: ${theme.colors.gold};
  font-family: ${theme.fonts.heading};
  letter-spacing: 0.5px;
`;

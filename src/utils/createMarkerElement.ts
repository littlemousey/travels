import { theme } from '../styles/GlobalStyles';

export function createMarkerElement(): { outerEl: HTMLDivElement; innerEl: HTMLDivElement } {
  const outerEl = document.createElement('div');
  outerEl.className = 'marker-container';
  Object.assign(outerEl.style, {
    width: '18px',
    height: '18px',
  });

  const innerEl = document.createElement('div');
  innerEl.className = 'custom-marker';

  Object.assign(innerEl.style, {
    width: '100%',
    height: '100%',
    borderRadius: '50% 50% 50% 0',
    background: theme.colors.gold,
    border: `2px solid ${theme.colors.cream}`,
    transform: 'rotate(-45deg)',
    transformOrigin: 'center center',
    boxShadow: '0 2px 8px rgba(0,0,0,0.4)',
    cursor: 'pointer',
    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
  });

  innerEl.addEventListener('mouseenter', () => {
    innerEl.style.transform = 'rotate(-45deg) scale(1.3)';
    innerEl.style.boxShadow = '0 3px 14px rgba(0,0,0,0.5)';
  });

  innerEl.addEventListener('mouseleave', () => {
    innerEl.style.transform = 'rotate(-45deg) scale(1)';
    innerEl.style.boxShadow = '0 2px 8px rgba(0,0,0,0.4)';
  });

  outerEl.appendChild(innerEl);

  return { outerEl, innerEl };
}

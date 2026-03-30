import { Global, css } from '@emotion/react';

export const theme = {
  colors: {
    cream: '#f5f0e8',
    ink: '#1a1612',
    sepia: '#8b6f47',
    gold: '#c9a84c',
    muted: '#6b5d4f',
    accent: '#3d6b5e',
    lightSepia: '#e8ddd0',
  },
  fonts: {
    heading: "'Playfair Display', serif",
    body: "'Cormorant Garamond', serif",
  },
};

export const GlobalStyles = () => (
  <Global
    styles={css`
      *, *::before, *::after {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
      }

      html {
        scroll-behavior: smooth;
      }

      body {
        font-family: ${theme.fonts.body};
        background: ${theme.colors.cream};
        color: ${theme.colors.ink};
        overflow: hidden;
      }

      #root {
        height: 100vh;
        overflow: hidden;
      }

      @media (max-width: 1024px) {
        body {
          overflow: hidden;
        }
      }

      /* MapLibre GL popup styles */
      .maplibregl-popup-content {
        font-family: ${theme.fonts.body};
        background: ${theme.colors.cream};
        border: 1px solid ${theme.colors.lightSepia};
        border-radius: 2px;
        padding: 1rem 1.2rem;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
        max-width: 200px;
      }

      .maplibregl-popup-content h3 {
        font-family: ${theme.fonts.heading};
        font-size: 0.95rem;
        font-weight: 400;
        color: ${theme.colors.ink};
        margin-bottom: 0.3rem;
      }

      .maplibregl-popup-content p {
        font-size: 0.8rem;
        color: ${theme.colors.muted};
        font-style: italic;
      }

      .maplibregl-popup-tip {
        border-top-color: ${theme.colors.cream} !important;
      }

      .maplibregl-popup-close-button {
        color: ${theme.colors.muted};
        font-size: 1.1rem;
        right: 6px;
        top: 4px;
      }
    `}
  />
);

# Reisherinneringen — Ans

An interactive map showcasing Ans' travel memories from 1991-1993, built with React and TypeScript.

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Deploy to GitHub Pages
npm run deploy
```

## 🛠️ Technology Stack

- **React 18** - Modern UI library
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and dev server
- **Emotion** - CSS-in-JS with styled components
- **MapLibre GL** - Interactive map rendering
- **React Context API** - State management
- **Google Fonts** - Playfair Display, Cormorant Garamond

## 📂 Project Structure

```
travels/
├── README.md                    # This file
├── .agent.md                    # AI agent instructions
├── src/                         # React application
│   ├── components/              # React components
│   │   ├── Map/                # Map-related components
│   │   ├── Story/              # Story-related components
│   │   └── Layout/             # Layout components
│   ├── context/                # React Context providers
│   ├── data/                   # Travel data (chapters & markers)
│   ├── hooks/                  # Custom React hooks
│   ├── styles/                 # Global styles and theme
│   ├── types/                  # TypeScript type definitions
│   ├── App.tsx                 # Root component
│   └── main.tsx                # Application entry point
├── package.json
├── tsconfig.json
├── vite.config.ts
└── index.html                  # HTML entry for React app
```

## ✨ Features

### Tab navigation
Three top-level tabs switch between the main views:
- **Reisverhalen** — scroll-driven story with a side-by-side map
- **Overzicht locaties** — interactive globe with all visited locations
- **Per decennium** — summary table and expandable decade cards

### Travel stories (Reisverhalen)
- Split-screen layout: sticky map on the left (55%), scrollable story on the right (45%)
- Scroll through chapters on desktop — the map automatically flies to the active location
- Custom gold map markers that grow and highlight when a chapter is active
- Clickable markers open a popup with the location name and description
- Map overlay with a vignette effect and a floating title badge (1991–2026)
- MapLibre navigation controls (zoom/rotation) rendered in the bottom-right corner

### Mobile layout (≤ 1024 px)
- Map stacks above the story panel instead of side-by-side
- Prev/next arrow buttons replace scroll-based chapter navigation
- Horizontal swipe gestures switch between chapters
- Animated progress bar shows current position within the chapter list

### Globe overview (Overzicht locaties)
- Full interactive 3D globe (MapLibre globe projection)
- All visited locations plotted as markers
- Markers on the hidden hemisphere are automatically hidden using a dot-product visibility check
- Hover popups show the location name and subtitle in a styled dark tooltip

### Decade overview (Per decennium)
- Summary table showing trips per continent per decade (hidden on small screens)
- Continent columns: Europa, Afrika, Noord-Amerika, Latijns-Amerika, Azië
- Colour-coded count badges per continent cell
- Expandable decade sections with a card grid of individual trips
- Milestone badges for chapters categorised as life events
- Life phase labels (Kind, Tiener, Jongvolwassene, Volwassene) with age ranges

### Responsive & accessible
- Responsive at three breakpoints: 1024 px, 768 px, and 480 px
- Tab labels shorten to a single word below 480 px
- Custom styled scrollbar in the story panel
- Focus-visible outlines on interactive map controls

## 🗺️ Travel timeline

The application covers Ans' life and travels from 1991 to 2026, spanning Europe, Africa, North America, Latin America, and Asia.

## 🎨 Design Philosophy

The design evokes vintage travel journals with:
- Elegant serif typography (Playfair Display, Cormorant Garamond)
- Warm color palette (cream, sepia, gold)
- Hand-crafted decorative elements
- Story-driven navigation

## 📝 Development

```bash
# Lint code
npm run lint

# Type check
npx tsc --noEmit
```

## 🚀 Deployment

This project is configured for GitHub Pages deployment:

### Deploy to GitHub Pages

```bash
npm run deploy
```

This command:
1. Builds the production bundle with TypeScript compilation
2. Deploys the `dist/` folder to the `gh-pages` branch
3. Makes the site available at `https://[username].github.io/travels/`

### Configuration

- **Base Path**: Set to `/travels/` in `vite.config.ts` for GitHub Pages
- **Deploy Tool**: Uses `gh-pages` package for automated deployment
- **Build Output**: `dist/` directory contains the production build

### First-Time Setup

1. Ensure your repository is named `travels` or update the `base` path in `vite.config.ts`
2. Enable GitHub Pages in repository settings (Settings → Pages → Source: gh-pages branch)
3. Run `npm run deploy` to publish

### Adding New Travels

To add new chapters:

1. Add data to `src/data/chapters.ts`
2. Add corresponding markers to `src/data/markers.ts`
3. Update the type definitions if needed in `src/types/index.ts`

## 📄 License

Personal project © Ans

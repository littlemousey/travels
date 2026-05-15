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

- **Interactive Map**: Scroll through travel stories and watch the map fly to each location
- **Custom Markers**: Clickable location pins with detailed information
- **Smooth Animations**: Elegant transitions between chapters
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Type-Safe**: Full TypeScript support in React version
- **Clean Architecture**: Separation of data, UI, and business logic

## 🗺️ Travel Timeline

The application showcases travels from:
- **1991**: Birth in Utrecht, Netherlands
- **1992**: First international trips (Germany, France, Belgium)
- **1993**: Italian adventure (Bolzano, Venice, Dolomites)

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

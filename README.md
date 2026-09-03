# ITINERA

**Personalized Dynamic Tour Planning & Tour Operations Platform**

Built for **HackCelestial 3.0 — Problem Statement 7**

## Overview

ITINERA is an AI-powered travel platform that plans personalized trips, recovers from disruptions in real time, and learns traveler preferences over time.

### Key Features

- **Trip DNA** — Learns your travel style from completed trips and personalizes future recommendations
- **Adapt Engine** — Detects disruptions, traces dependencies, and offers ranked recovery alternatives
- **Unified Platform** — Travelers and operators share the same trip data from two purpose-built interfaces

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 19, Vite 8, Tailwind CSS 4, Framer Motion |
| Backend | Node.js, Express |
| Database | Firebase Firestore |
| Auth | Firebase Authentication |
| AI | Google Gemini API |

## Getting Started

```bash
cd itinera-client
npm install
npm run dev
```

## Project Structure

```
itinera-client/src/
├── components/
│   ├── ui/          # Button, Card, Input, Badge
│   └── layout/      # Navbar, Footer, PageWrapper
├── pages/           # Route-level page components
├── features/        # Feature-specific components (trip, adapt, dna, operator)
├── context/         # React Context providers
├── hooks/           # Custom React hooks
├── services/        # API and Firebase service layer
├── data/            # Mock/seed data
├── utils/           # Utility functions
├── App.jsx          # Router setup
├── main.jsx         # Entry point
└── index.css        # Design system (Tailwind v4 @theme)
```

## License

MIT

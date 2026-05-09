# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Repository Structure

The repo has two main parts:

- `portfolio/` - the Next.js source code; all development work happens here
- `docs/` - the built static export committed to `main` for GitHub Pages hosting; **never edit directly**

## Development Commands

All commands run from the `portfolio/` directory:

```bash
cd portfolio
npm install       # first time setup
npm run dev       # start local dev server (hot reload)
npm run build     # static export to portfolio/out/
npm run lint      # ESLint
```

There are no tests (`npm test` is a no-op stub).

## Deployment

Merging to `main` triggers `.github/workflows/deploy.yml`, which:
1. Builds with `NEXT_BASE_PATH=/space-portfolio` (auto-detected from repo name)
2. Copies `portfolio/out/` to `docs/`
3. Commits and pushes `docs/` to `main` with `[skip ci]`

The live site is at `https://cameronloveland.github.io/space-portfolio/`.

## Architecture

### Routing and layout

Single-page app using Next.js App Router (`src/app/`). The only route is `page.tsx`, which is an **async server component** that fetches GitHub data at build time (ISR with 1-hour revalidation).

`layout.tsx` wraps everything in `<ParallaxHandler>`, a client component that fires a global `earthParallax` custom DOM event on mouse move. Components across the tree listen to this event to drive coordinated parallax without prop drilling.

### Component layers

```
layout.tsx (ParallaxHandler - emits earthParallax events)
└── page.tsx (async server component - fetches repos at build)
    ├── SpaceBackground (client - stars, comets, SpinningEarth, ShootingStars)
    │   └── SpinningEarth → EarthWithLayers (Three.js/react-three-fiber)
    ├── CockpitOverlay
    ├── FloatingAstronaut
    └── HUD row (fixed bottom, 3-column grid)
        ├── Projects (repos fetched server-side, passed as props)
        ├── Terminal (client - easter-egg command parser)
        └── RadioPlayer + Logs (client - fetch GitHub API client-side)
```

### Key utilities

- `src/lib/publicPath.ts` - wraps all `public/` asset paths with `NEXT_PUBLIC_BASE_PATH` prefix; use `publicPath("/foo.png")` instead of bare `/foo.png` strings for any `public/` asset reference
- `src/api/github.ts` - all GitHub API calls (commits, PRs, repos with README summaries); uses `next: { revalidate: 3600 }` for ISR caching

### Styling

Tailwind CSS v4 with a sci-fi cyan glow palette. Shared HUD component classes (`hud-panel`, `hud-aside-container`, `hud-scroll`, `digital-glow`) are defined in `src/styles/theme.css`. Custom keyframe animations live in `src/styles/animations.css`. Do not add inline styles for things already covered by these classes.

### 3D Earth

`SpinningEarth` wraps a `<Canvas>` from `@react-three/fiber`. `EarthWithLayers` (inside the canvas) uses `useTexture` from `@react-three/drei` to load textures from `public/textures/`. The Earth reacts to the `earthParallax` custom event via a listener in `SpaceBackground`.

## Important Constraints

- Always use `publicPath()` for any reference to files in `public/` - assets break on GitHub Pages without the base path prefix.
- The `docs/` directory is build output; it is committed to `main` and served by GitHub Pages. Never hand-edit it.
- The `out/` directory inside `portfolio/` is local build output; it mirrors `docs/` and is gitignored.
- Commit messages must follow Conventional Commits (`@commitlint/config-conventional` is installed).

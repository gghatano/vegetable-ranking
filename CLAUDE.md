# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Japanese vegetable ranking application built with React and Vite. Users can drag-and-drop vegetables to create a top-5 ranking, add comments, and export results.

## Development Commands

```bash
npm install      # Install dependencies
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Architecture

Single-page React application (`src/App.jsx`) with:
- Drag-and-drop ranking system (native HTML5 drag events)
- LocalStorage persistence for rankings, vegetables list, and comments
- Two screens: ranking editor and results view
- HTML export functionality (user prints to PDF via browser)

State management uses React hooks (`useState`, `useEffect`) - no external state library.

## Styling

Uses Tailwind CSS utility classes. Vegetable cards have color-coded backgrounds based on vegetable type (defined in `VEGETABLE_COLORS` constant).

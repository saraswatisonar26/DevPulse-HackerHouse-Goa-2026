# DevPulse

**Hacker House Goa 2026 · Wispr Flow Shortlisting Task**

DevPulse is a dark-themed productivity dashboard for organizing daily tasks, tracking focus time, capturing quick notes, and keeping personal goals in view.

## The problem

Tasks, ideas, and goals can end up scattered across different tools, making it harder to maintain focus and see progress. DevPulse brings these essentials together in one responsive workspace, with browser storage for keeping tasks, notes, and goals between visits.

## Features

- **Productivity dashboard** with a summary of tasks, focus time, daily progress, and weekly goals.
- **Task management** with task creation and browser `localStorage` persistence.
- **25-minute focus timer** with start, pause, and reset controls.
- **Quick Notes** to create and delete titled notes, saved in browser `localStorage`.
- **Goals** with a title and target description, a progress indicator, and a completion action. Completed status is saved in browser `localStorage`.
- **Responsive dark theme** with a purple accent, designed for desktop, tablet, and mobile screens.

## Voice-driven development

This project was built individually for the Hacker House Goa 2026 Wispr Flow Shortlisting Task using voice-driven development with Wispr Flow.

## Technology stack

- React
- Vite
- JavaScript
- HTML
- CSS
- Browser `localStorage`

## Getting started

Requirements: Node.js and npm.

```bash
npm install
npm run dev
```

Open the local URL printed by Vite in your browser.

## Project structure

```text
DevPulse/
├── index.html
├── package.json
├── public/
└── src/
    ├── App.jsx       # Dashboard and interactive features
    ├── App.css       # Dashboard styling and responsive layouts
    ├── index.css     # Global styles
    ├── main.jsx      # React application entry point
    └── assets/
```

## Testing and checks

There is no dedicated automated test script in the project. Use the available build and lint checks:

```bash
npm run build
npm run lint
```

## Future improvements

- Add automated tests for the timer and local-storage workflows.
- Support more detailed, incremental goal progress.
- Add task editing and completion controls.

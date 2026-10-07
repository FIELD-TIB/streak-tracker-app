# Streak Tracker App

A polished daily streak tracker built for productivity, habit consistency, and short-term focus management. The app combines a simple habit streak dashboard with a task manager and reminder widget so users can keep momentum without feeling overwhelmed.

## Highlights

- Daily streak tracking with progress badges and reminders
- Task manager with priority levels and completion states
- Local storage persistence for streaks and tasks
- Dark-mode support with a theme toggle
- Responsive, clean interface optimized for both desktop and mobile
- Ready to run as a local web app or packaged into a desktop executable

## Features

- Add and remove streaks with custom conditions and reminders
- Increment a streak manually to reflect progress
- Create tasks with due dates and priority categories
- Mark tasks complete or revert them when needed
- Get a "Today's focus" widget that highlights the next priority action
- Save all data locally in the browser's localStorage

## Project structure

- `index.html` — main dashboard UI
- `styles.css` — app styling and responsive layout
- `app.js` — widget and task/streak interactions
- `theme.js` — theme toggling and dark/light mode behavior
- `storage.js` — persistent local storage logic
- `server.js` — local static server for running the app
- `build-exe.js` — script to build an executable package
- `README.md` — project documentation

## Run locally

### Option 1: Open directly

Open `index.html` in a browser.

### Option 2: Start the local web server

```bash
npm install
npm start
```

Then visit:

```text
http://localhost:3000
```

## Build a Windows executable

This project includes a packaging script that generates a `.exe` with `pkg`.

```bash
npm install
npm run build:exe
```

The generated executable appears in the `dist/` directory.

## Notes

- Data is stored in the browser using `localStorage`, so it persists on the same device/browser.
- The app is intentionally lightweight and dependency-friendly for quick setup.
- You can customize the default streaks and tasks in `storage.js`.

## License

MIT

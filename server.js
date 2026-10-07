const express = require('express');
const path = require('path');

const app = express();
const port = Number(process.env.PORT) || 3000;
const rootDir = __dirname;

app.use(express.static(rootDir));

app.get('/health', (_req, res) => {
  res.json({ ok: true, app: 'streak-tracker-app' });
});

app.get('*', (req, res, next) => {
  if (req.path.includes('.')) {
    return next();
  }
  res.sendFile(path.join(rootDir, 'index.html'));
});

app.listen(port, () => {
  console.log(`Streak Tracker app is running on http://localhost:${port}`);
});

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist');
fs.mkdirSync(distDir, { recursive: true });

const target = process.platform === 'win32' ? 'node18-win-x64' : 'node18-linux-x64';
const outputName = process.platform === 'win32' ? 'streak-tracker-app.exe' : 'streak-tracker-app';
const outputPath = path.join(distDir, outputName);

try {
  console.log(`Building executable for ${target}...`);
  execSync(`npx pkg . --targets ${target} --output ${outputPath}`, {
    stdio: 'inherit',
    env: process.env,
  });
  console.log(`Executable created at: ${outputPath}`);
} catch (error) {
  console.error('Failed to build the executable.');
  console.error('Install dependencies with: npm install');
  console.error('Then run: npm run build:exe');
  process.exit(1);
}

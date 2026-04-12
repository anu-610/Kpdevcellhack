// Setup script - run with: node setup.js
const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');
const dirs = ['lib', 'context', 'components', 'pages', 'admin'];

dirs.forEach(dir => {
  const fullPath = path.join(srcDir, dir);
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
    console.log(`Created: ${fullPath}`);
  } else {
    console.log(`Already exists: ${fullPath}`);
  }
});

console.log('\\nDirectory setup complete! Now run:');
console.log('npm install cobe');
console.log('\\nThen the project structure is ready.');

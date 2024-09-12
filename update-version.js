const fs = require('fs');
const { execSync } = require('child_process');

// Get the current commit hash
const revision = execSync('git rev-parse --short HEAD').toString().trim();

// Update the environment.version.ts file with the commit hash
const versionContent = `export const VERSION = {
  revision: '${revision}'
};\n`;

fs.writeFileSync('src/environments/environment.version.ts', versionContent);
console.log('Version file updated with commit hash:', revision);

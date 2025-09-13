// scripts/createConfig.js
import fs from 'fs';
import path from 'path';

// Where to create the config file
const configPath = path.join(process.cwd(), 'abhaya.config.js');

if (!fs.existsSync(configPath)) {
  const defaultConfig = `
// Abhaya Config for ClipNep
export default {
  thumbnailTime: 2, // default time in seconds to capture thumbnail
  outputFormat: 'png', // default thumbnail format
};
`;
  fs.writeFileSync(configPath, defaultConfig.trim());
  console.log('✅ Created default abhaya.config.js in your project!');
} else {
  console.log('⚠️ abhaya.config.js already exists. Skipping creation.');
}

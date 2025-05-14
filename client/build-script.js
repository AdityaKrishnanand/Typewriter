// build-script.js
import { build } from 'vite';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

async function runBuild() {
  console.log('Starting Vite build...');
  
  try {
    const result = await build({
      configFile: resolve(__dirname, 'vite.config.js'),
      mode: 'production',
    });
    
    console.log('Build completed successfully!');
    return result;
  } catch (error) {
    console.error('Build failed:', error);
    process.exit(1);
  }
}

runBuild();
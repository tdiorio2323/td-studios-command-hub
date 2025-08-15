#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const LOGGER_IMPORT = "import { logger } from '@/lib/logger';\n";

function findFiles(dir, extensions) {
  let results = [];
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const filepath = path.join(dir, file);
    const stat = fs.statSync(filepath);
    
    if (stat.isDirectory() && file !== 'node_modules' && !file.startsWith('.')) {
      results = results.concat(findFiles(filepath, extensions));
    } else if (extensions.some(ext => file.endsWith(ext))) {
      results.push(filepath);
    }
  }
  
  return results;
}

function optimizeLogging() {
  // Find all TypeScript/JavaScript files
  const files = findFiles('src', ['.ts', '.tsx', '.js', '.jsx'])
    .filter(file => !file.includes('lib/logger.ts'));

  let totalReplacements = 0;

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf-8');
    let modified = false;
    
    // Replace console.log with logger.info
    if (content.includes('console.log')) {
      content = content.replace(/console\.log\(/g, 'logger.info(');
      modified = true;
    }
    
    // Replace console.error with logger.error
    if (content.includes('console.error')) {
      content = content.replace(/console\.error\(/g, 'logger.error(');
      modified = true;
    }
    
    // Replace console.warn with logger.warn
    if (content.includes('console.warn')) {
      content = content.replace(/console\.warn\(/g, 'logger.warn(');
      modified = true;
    }
    
    // Add logger import if modified and not already present
    if (modified && !content.includes("from '@/lib/logger'")) {
      // Add import after existing imports
      const importMatch = content.match(/^import .* from .*;$/m);
      if (importMatch) {
        const lastImportIndex = content.lastIndexOf(importMatch[0]) + importMatch[0].length;
        content = content.slice(0, lastImportIndex) + '\n' + LOGGER_IMPORT + content.slice(lastImportIndex);
      } else {
        content = LOGGER_IMPORT + content;
      }
      
      fs.writeFileSync(file, content);
      totalReplacements++;
      console.log(`✅ Updated: ${file}`);
    }
  }
  
  console.log(`\n📊 Optimized logging in ${totalReplacements} files`);
}

// Add production check to logger
const loggerContent = `
import { isDevelopment } from '@/lib/utils';

export const logger = {
  info: (...args: any[]) => {
    if (isDevelopment()) {
      console.log('[INFO]', ...args);
    }
  },
  error: (...args: any[]) => {
    console.error('[ERROR]', ...args);
  },
  warn: (...args: any[]) => {
    if (isDevelopment()) {
      console.warn('[WARN]', ...args);
    }
  },
  debug: (...args: any[]) => {
    if (isDevelopment() && process.env.DEBUG) {
      console.log('[DEBUG]', ...args);
    }
  }
};
`;

// Update logger if it doesn't exist or is basic
const loggerPath = path.join(process.cwd(), 'src/lib/logger.ts');
if (!fs.existsSync(loggerPath) || fs.readFileSync(loggerPath, 'utf-8').length < 100) {
  fs.writeFileSync(loggerPath, loggerContent.trim());
  console.log('✅ Created optimized logger');
}

// Remove async/await and call directly
optimizeLogging();
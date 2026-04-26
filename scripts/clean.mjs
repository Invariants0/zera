import { rmSync } from 'node:fs';

const pathsToRemove = [
  'node_modules',
  'logs',
  'contracts/node_modules',
  'contracts/dist',
  'contracts/src/managed',
  'web/node_modules',
  'web/.next',
  'web/dist',
  'web/public/managed'
];

console.log('🧹 Cleaning project...');
for (const path of pathsToRemove) {
  try {
    rmSync(path, { recursive: true, force: true });
    console.log(`  - Removed: ${path}`);
  } catch (err) {
    console.error(`  - Failed to remove ${path}:`, err.message);
  }
}
console.log('✅ Clean complete.');

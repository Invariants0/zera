import { rmSync } from 'node:fs';

const pathsToRemove = ['logs', 'node_modules', '.next', 'dist', 'storage/ipfs/target'];

for (const path of pathsToRemove) {
  rmSync(path, { recursive: true, force: true });
}

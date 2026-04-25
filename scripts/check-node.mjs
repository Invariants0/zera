const requiredMajor = 22;
const [major] = process.versions.node.split('.').map(Number);

if (major < requiredMajor) {
  console.error(
    `Node ${requiredMajor}.x or newer is required. Detected ${process.version}. Use nvm use or the project's .nvmrc before running npm install.`
  );
  process.exit(1);
}

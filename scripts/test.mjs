import { readdirSync } from 'node:fs';
import { resolve } from 'node:path';
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../', import.meta.url));
const directories = process.argv.slice(2);

function discover(directory) {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = resolve(directory, entry.name);
    if (entry.isDirectory()) return discover(path);
    return entry.isFile() && entry.name.endsWith('.test.mjs') ? [path] : [];
  });
}

const files = (directories.length ? directories : ['src'])
  .flatMap((directory) => discover(resolve(root, directory)))
  .sort();

if (!files.length) {
  console.error('No co-located unit tests found.');
  process.exitCode = 1;
} else {
  const child = spawn(
    process.execPath,
    // Expo does not declare a root module type. Keep other Node diagnostics visible.
    [
      '--disable-warning=MODULE_TYPELESS_PACKAGE_JSON',
      '--experimental-strip-types',
      '--test',
      ...files,
    ],
    {
      cwd: root,
      stdio: 'inherit',
    },
  );
  child.on('error', (error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
  child.on('exit', (code) => {
    process.exitCode = code ?? 1;
  });
}

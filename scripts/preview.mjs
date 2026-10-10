import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
const child = spawn(
  process.execPath,
  [
    '--dns-result-order=ipv4first',
    require.resolve('expo/bin/cli'),
    'start',
    '--localhost',
    ...process.argv.slice(2),
  ],
  {
    stdio: 'inherit',
    env: { ...process.env, ONIZY_WEB_PREVIEW: '1' },
  },
);

child.on('error', (error) => {
  console.error(error.message);
  process.exitCode = 1;
});
child.on('exit', (code) => {
  process.exitCode = code ?? 1;
});

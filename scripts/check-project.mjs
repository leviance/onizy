import { access, readFile, readdir } from 'node:fs/promises';
import { dirname, extname, relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';
import ts from 'typescript';

const root = fileURLToPath(new URL('../', import.meta.url));
const excluded = new Set(['node_modules', '.expo', 'dist', '.git', 'android', 'ios', 'coverage']);
const mediaExtension = /\.(png|jpe?g|gif|webp|avif|svg|ttf|otf|woff2?|mp3|wav|mp4|webm)$/i;
const errors = [];
const referencedAssets = new Set();
const label = (file) => relative(root, file).split(sep).join('/');
const assetKey = (file) => resolve(file).toLowerCase();

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries
      .filter((entry) => !excluded.has(entry.name))
      .map(async (entry) => {
        const path = resolve(directory, entry.name);
        if (entry.isDirectory()) return walk(path);
        return entry.isFile() ? [path] : [];
      }),
  );
  return nested.flat();
}

async function checkTarget(file, target, description) {
  try {
    await access(target);
    const actual = pathsByCase.get(assetKey(target));
    if (actual && label(actual) !== label(target))
      errors.push(
        `${label(file)}: ${description} case mismatch: ${label(target)}; use ${label(actual)}.`,
      );
  } catch {
    errors.push(`${label(file)}: ${description} does not exist: ${label(target)}`);
  }
}

const files = await walk(root);
const pathsByCase = new Map(files.map((file) => [assetKey(file), file]));
let markdownLinks = 0;

function checkImport(file, reference) {
  if (!reference.startsWith('.') && !reference.startsWith('@/')) return;
  const target = reference.startsWith('@/')
    ? resolve(root, 'src', reference.slice(2))
    : resolve(dirname(file), reference);
  const candidates = [
    target,
    ...['.ts', '.tsx', '.mjs', '.js', '.json'].flatMap((extension) => [
      target + extension,
      resolve(target, 'index' + extension),
    ]),
  ];
  const match = candidates.find((path) => pathsByCase.has(assetKey(path)));
  if (match) {
    const actual = pathsByCase.get(assetKey(match));
    if (label(actual) !== label(match))
      errors.push(`${label(file)}: import case mismatch: ${reference}; use ${label(actual)}.`);
  }
}

for (const file of files) {
  if (extname(file) === '.md') {
    const content = (await readFile(file, 'utf8')).replace(/^```[^\n]*\n[\s\S]*?^```/gm, '');
    for (const match of content.matchAll(/!?\[[^\]]*\]\((<[^>]+>|[^\s)]+)\)/g)) {
      const url = match[1].replace(/^<|>$/g, '');
      if (/^[a-z][a-z\d+.-]*:/i.test(url) || url.startsWith('#')) continue;
      const path = decodeURIComponent(url.split(/[?#]/, 1)[0]);
      await checkTarget(file, resolve(dirname(file), path), 'Markdown link');
      markdownLinks += 1;
    }
  }

  if (!/\.(?:tsx?|mjs)$/.test(file)) continue;
  const syntax = ts.createSourceFile(
    file,
    await readFile(file, 'utf8'),
    ts.ScriptTarget.Latest,
    true,
  );
  const references = [];
  function visit(node) {
    if (
      ts.isCallExpression(node) &&
      ts.isIdentifier(node.expression) &&
      node.expression.text === 'require' &&
      node.arguments.length === 1 &&
      ts.isStringLiteral(node.arguments[0])
    ) {
      const path = node.arguments[0].text;
      if (path.startsWith('.') && mediaExtension.test(path)) references.push(path);
    }
    if (
      (ts.isImportDeclaration(node) || ts.isExportDeclaration(node)) &&
      node.moduleSpecifier &&
      ts.isStringLiteral(node.moduleSpecifier)
    ) {
      const path = node.moduleSpecifier.text;
      checkImport(file, path);
      if (path.startsWith('.') && mediaExtension.test(path)) references.push(path);
    }
    if (
      label(file) === 'app.config.ts' &&
      ts.isStringLiteral(node) &&
      node.text.startsWith('./assets/')
    ) {
      references.push(node.text);
    }
    ts.forEachChild(node, visit);
  }
  visit(syntax);

  for (const reference of references) {
    const target = resolve(dirname(file), reference);
    await checkTarget(file, target, 'Asset');
    referencedAssets.add(assetKey(target));
    if (label(file).startsWith('src/') && !label(file).includes('/assets/')) {
      errors.push(`${label(file)}: register local media in the owning module's assets directory.`);
    }
  }
}

for (const file of files) {
  const base = file.replace(/@[23]x(?=\.(?:png|jpe?g|webp|avif)$)/i, '');
  if (base !== file && referencedAssets.has(assetKey(base))) {
    referencedAssets.add(assetKey(file));
  }
}

for (const file of files) {
  if (
    label(file).startsWith('assets/') &&
    mediaExtension.test(file) &&
    !referencedAssets.has(assetKey(file))
  ) {
    errors.push(`${label(file)}: missing an owning asset declaration or build-config reference.`);
  }
}

if (errors.length > 0) {
  errors.forEach((error) => console.error(error));
  process.exitCode = 1;
} else {
  console.log(
    `Project structure OK: ${referencedAssets.size} assets and ${markdownLinks} local Markdown links checked.`,
  );
}

import { Buffer } from 'node:buffer';
import { readFile, readdir } from 'node:fs/promises';
import { relative, resolve, sep } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = fileURLToPath(new URL('../assets/', import.meta.url));
const pngSignature = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);
const rasterExtension = /\.(?:png|jpe?g|webp|avif|gif)$/i;
const errors = [];
const families = new Map();
let rasterCount = 0;
let totalBytes = 0;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const nested = await Promise.all(
    entries.map(async (entry) => {
      const path = resolve(directory, entry.name);
      if (entry.isDirectory()) return walk(path);
      return entry.isFile() && rasterExtension.test(entry.name) ? [path] : [];
    }),
  );
  return nested.flat();
}

for (const file of await walk(root)) {
  const name = relative(root, file).split(sep).join('/');
  if (!name.endsWith('.png')) {
    errors.push(`${name}: add format-specific dimension and byte checks before using this format.`);
    continue;
  }
  const bytes = await readFile(file);
  if (
    bytes.length < 33 ||
    !bytes.subarray(0, 8).equals(pngSignature) ||
    bytes.toString('ascii', 12, 16) !== 'IHDR'
  ) {
    errors.push(`${name}: invalid PNG header.`);
    continue;
  }

  const densityMatch = name.match(/@(\d+)x\.png$/);
  const density = densityMatch ? Number(densityMatch[1]) : 1;
  const familyName = name.replace(/@\d+x(?=\.png$)/, '');
  const family = families.get(familyName) ?? new Map();
  if (![1, 2, 3].includes(density) || (densityMatch && density === 1)) {
    errors.push(`${name}: use an unsuffixed 1x PNG and @2x/@3x variants.`);
  }
  family.set(density, {
    name,
    width: bytes.readUInt32BE(16),
    height: bytes.readUInt32BE(20),
    bytes: bytes.length,
  });
  families.set(familyName, family);
  rasterCount += 1;
  totalBytes += bytes.length;
}

for (const [name, family] of families) {
  const base = family.get(1);
  if (!base) {
    errors.push(`${name}: density variants require an unsuffixed base file.`);
    continue;
  }
  if (name.startsWith('app-icons/')) {
    if (family.size !== 1 || base.width !== 1024 || base.height !== 1024) {
      errors.push(`${name}: native launcher icons must be a single 1024 x 1024 PNG.`);
    }
    if (base.bytes > 1024 * 1024) errors.push(`${name}: launcher icon exceeds 1024 KiB.`);
    continue;
  }

  const logicalEdge = Math.max(base.width, base.height);
  const budgetKiB = logicalEdge <= 128 ? 100 : logicalEdge <= 320 ? 512 : 1024;
  if (base.width < 1 || base.height < 1 || logicalEdge > 512) {
    errors.push(`${name}: runtime base dimensions must be 1-512 px; match the intended dp size.`);
  }
  for (const density of [1, 2, 3]) {
    if (!family.has(density)) errors.push(`${name}: missing ${density}x density variant.`);
  }
  for (const [density, asset] of family) {
    if (asset.width !== base.width * density || asset.height !== base.height * density) {
      errors.push(
        `${asset.name}: dimensions must be exactly ${density} times the base dimensions.`,
      );
    }
    if (asset.bytes > budgetKiB * 1024) {
      errors.push(`${asset.name}: exceeds the ${budgetKiB} KiB budget for this runtime size.`);
    }
  }
}

if (errors.length > 0) {
  errors.forEach((error) => console.error(error));
  process.exitCode = 1;
} else {
  console.log(
    `Asset budgets OK: ${families.size} families, ${rasterCount} PNGs, ${Math.round(totalBytes / 1024)} KiB across all densities.`,
  );
}

// Validates every file in logos/ and writes index.json.
// Usage: node scripts/build-index.js [--check]
const fs = require('fs');
const path = require('path');

const LOGO_DIR = path.join(__dirname, '..', 'logos');
const INDEX_PATH = path.join(__dirname, '..', 'index.json');
const MAX_BYTES = 1024 * 1024;
const PNG_SIG = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);

const errors = [];
const logos = {};

for (const file of fs.readdirSync(LOGO_DIR).sort()) {
  if (file.startsWith('.')) continue;
  const m = /^(\d+)\.png$/.exec(file);
  if (!m) {
    errors.push(`${file}: must be named <apple-music-artist-id>.png`);
    continue;
  }
  const buf = fs.readFileSync(path.join(LOGO_DIR, file));
  if (buf.length > MAX_BYTES) errors.push(`${file}: larger than 1 MB`);
  if (buf.length < 33 || !buf.subarray(0, 8).equals(PNG_SIG)) {
    errors.push(`${file}: not a valid PNG`);
    continue;
  }
  const width = buf.readUInt32BE(16);
  const height = buf.readUInt32BE(20);
  const colorType = buf[25];
  if (width < 200 || height < 20) errors.push(`${file}: too small (${width}x${height}, min 200x20)`);
  if (width > 2400 || height > 1200) errors.push(`${file}: too large (${width}x${height}, max 2400x1200)`);
  if (colorType !== 4 && colorType !== 6 && colorType !== 3) errors.push(`${file}: must have transparency (RGBA)`);
  logos[m[1]] = { file: `logos/${file}`, width, height };
}

if (errors.length) {
  console.error(errors.join('\n'));
  process.exit(1);
}

const out = JSON.stringify({ version: 1, logos }, null, 2) + '\n';
if (process.argv.includes('--check')) {
  console.log(`OK: ${Object.keys(logos).length} logos`);
} else {
  fs.writeFileSync(INDEX_PATH, out);
  console.log(`Wrote index.json with ${Object.keys(logos).length} logos`);
}

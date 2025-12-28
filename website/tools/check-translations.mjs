import { readFileSync, readdirSync, statSync } from 'node:fs';
import path from 'node:path';

const websiteRoot = path.resolve(process.cwd(), 'website');
const languageSwitcherPath = path.join(websiteRoot, 'assets', 'js', 'language-switcher.js');

function walk(dir, out = []) {
  for (const entry of readdirSync(dir)) {
    const p = path.join(dir, entry);
    const st = statSync(p);
    if (st.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

function extractDataLangKeysFromHtml(html) {
  const keys = new Set();
  const re = /data-lang\s*=\s*"([^"]+)"/g;
  let m;
  while ((m = re.exec(html))) keys.add(m[1]);
  const re2 = /data-lang-placeholder\s*=\s*"([^"]+)"/g;
  while ((m = re2.exec(html))) keys.add(m[1]);
  return keys;
}

function extractObjectBlock(text, label) {
  const m = text.match(new RegExp(`\\b${label}\\s*:\\s*\\{`));
  if (!m) throw new Error(`Missing "${label}: { ... }" block in language-switcher.js`);
  const start = text.indexOf(m[0]) + m[0].length - 1; // points to '{'

  let depth = 0;
  let blockStart = -1;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (ch === '{') {
      depth += 1;
      if (blockStart === -1) blockStart = i + 1;
    } else if (ch === '}') {
      depth -= 1;
      if (depth === 0 && blockStart !== -1) return text.slice(blockStart, i);
    }
  }
  throw new Error(`Unclosed "${label}" block in language-switcher.js`);
}

function extractKeysFromBlock(blockText) {
  const keys = [];
  const re = /^\s*([A-Za-z_$][A-Za-z0-9_$]*)\s*:/gm;
  let m;
  while ((m = re.exec(blockText))) keys.push(m[1]);
  return keys;
}

function findDuplicates(list) {
  const seen = new Set();
  const dups = new Set();
  for (const k of list) {
    if (seen.has(k)) dups.add(k);
    seen.add(k);
  }
  return [...dups].sort();
}

const htmlFiles = walk(websiteRoot).filter(p => p.endsWith('.html'));
const usedKeys = new Set();
for (const file of htmlFiles) {
  const html = readFileSync(file, 'utf-8');
  for (const k of extractDataLangKeysFromHtml(html)) usedKeys.add(k);
}

const switcher = readFileSync(languageSwitcherPath, 'utf-8');
const enBlock = extractObjectBlock(switcher, 'en');
const vlBlock = extractObjectBlock(switcher, 'vl');
const enKeyList = extractKeysFromBlock(enBlock);
const vlKeyList = extractKeysFromBlock(vlBlock);
const enKeys = new Set(enKeyList);
const vlKeys = new Set(vlKeyList);

const missingEn = [...usedKeys].filter(k => !enKeys.has(k)).sort();
const missingVl = [...usedKeys].filter(k => !vlKeys.has(k)).sort();
const dupEn = findDuplicates(enKeyList);
const dupVl = findDuplicates(vlKeyList);

let ok = true;
if (dupEn.length) {
  ok = false;
  console.error('[i18n] Duplicate keys in en:', dupEn.join(', '));
}
if (dupVl.length) {
  ok = false;
  console.error('[i18n] Duplicate keys in vl:', dupVl.join(', '));
}
if (missingEn.length) {
  ok = false;
  console.error('[i18n] Missing keys in en:', missingEn.join(', '));
}
if (missingVl.length) {
  ok = false;
  console.error('[i18n] Missing keys in vl:', missingVl.join(', '));
}

if (ok) {
  console.log(`[i18n] OK: ${usedKeys.size} keys covered (en/vl), no duplicates.`);
} else {
  process.exitCode = 1;
}


#!/usr/bin/env node

'use strict';

const path = require('path');
const { loadImage } = require('./imageLoader');
const { extractPalette } = require('./palette');
const { getColorLabel, sortByLuminance } = require('./colorUtils');

const args = process.argv.slice(2);

function printUsage() {
  console.log('Usage: ember-palette <image-path> [options]');
  console.log('');
  console.log('Options:');
  console.log('  --colors <n>    Number of colors to extract (default: 6)');
  console.log('  --json          Output results as JSON');
  console.log('  --help          Show this help message');
}

function parseArgs(args) {
  const opts = { colors: 6, json: false, imagePath: null };

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--help') {
      printUsage();
      process.exit(0);
    } else if (args[i] === '--json') {
      opts.json = true;
    } else if (args[i] === '--colors' && args[i + 1]) {
      const n = parseInt(args[++i], 10);
      if (!isNaN(n) && n > 0) opts.colors = n;
    } else if (!args[i].startsWith('--')) {
      opts.imagePath = args[i];
    }
  }

  return opts;
}

async function run() {
  const opts = parseArgs(args);

  if (!opts.imagePath) {
    console.error('Error: No image path provided.');
    printUsage();
    process.exit(1);
  }

  const resolvedPath = path.resolve(opts.imagePath);

  try {
    const pixels = await loadImage(resolvedPath);
    const palette = extractPalette(pixels, opts.colors);
    const sorted = sortByLuminance(palette);

    if (opts.json) {
      const output = sorted.map(color => ({
        hex: color.hex,
        rgb: color.rgb,
        label: getColorLabel(color.rgb)
      }));
      console.log(JSON.stringify(output, null, 2));
    } else {
      console.log(`\nExtracted ${sorted.length} colors from: ${opts.imagePath}\n`);
      sorted.forEach((color, i) => {
        const label = getColorLabel(color.rgb);
        console.log(`  ${i + 1}. ${color.hex}  —  ${label}`);
      });
      console.log('');
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

run();

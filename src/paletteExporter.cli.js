#!/usr/bin/env node
/**
 * Standalone CLI helper for exporting a saved palette file.
 * Usage: node paletteExporter.cli.js <palette.json> <format> <output>
 * Formats: json | css | scss
 */
import fs from 'fs';
import path from 'path';
import { exportPalette } from './paletteExporter.js';

function printUsage() {
  console.log('Usage: ember-palette-export <palette.json> <format> <output>');
  console.log('Formats: json | css | scss');
  console.log('Example: ember-palette-export palette.json css ./dist/palette.css');
}

function run(argv) {
  const args = argv.slice(2);

  if (args.length < 3 || args.includes('--help') || args.includes('-h')) {
    printUsage();
    process.exit(args.includes('--help') || args.includes('-h') ? 0 : 1);
  }

  const [inputFile, format, outputFile] = args;

  if (!fs.existsSync(inputFile)) {
    console.error(`Error: input file not found — ${inputFile}`);
    process.exit(1);
  }

  const validFormats = ['json', 'css', 'scss'];
  if (!validFormats.includes(format)) {
    console.error(`Error: unsupported format "${format}". Choose from: ${validFormats.join(', ')}`);
    process.exit(1);
  }

  let parsed;
  try {
    const raw = fs.readFileSync(inputFile, 'utf8');
    parsed = JSON.parse(raw);
  } catch (err) {
    console.error(`Error: could not parse input file — ${err.message}`);
    process.exit(1);
  }

  const palette = parsed.colors ?? parsed;
  const theme = parsed.theme ?? null;

  if (!Array.isArray(palette)) {
    console.error('Error: input file must contain an array of color objects.');
    process.exit(1);
  }

  try {
    exportPalette(palette, format, outputFile, theme);
    console.log(`✔ Exported ${palette.length} colors as ${format.toUpperCase()} → ${outputFile}`);
  } catch (err) {
    console.error(`Error during export: ${err.message}`);
    process.exit(1);
  }
}

run(process.argv);

#!/usr/bin/env node
'use strict';

const { exportHarmony } = require('./colorHarmonyExporter');

function printUsage() {
  console.log(`
Usage: ember-palette harmony <hex> [options]

Arguments:
  hex           Base hex color (e.g. #ff6600)

Options:
  --format      Output format: json | css | scss  (default: json)
  --help        Show this help message

Examples:
  ember-palette harmony #3399cc
  ember-palette harmony #3399cc --format css
  ember-palette harmony #3399cc --format scss
`.trim());
}

function run(argv = process.argv.slice(2)) {
  if (argv.includes('--help') || argv.length === 0) {
    printUsage();
    return;
  }

  const hex = argv[0];

  if (!/^#[0-9a-fA-F]{6}$/.test(hex)) {
    console.error(`Error: "${hex}" is not a valid 6-digit hex color.`);
    console.error('Example: #ff6600');
    process.exit(1);
  }

  const formatIndex = argv.indexOf('--format');
  const format = formatIndex !== -1 ? argv[formatIndex + 1] : 'json';

  const validFormats = ['json', 'css', 'scss'];
  if (!validFormats.includes(format)) {
    console.error(`Error: Unknown format "${format}". Choose from: ${validFormats.join(', ')}`);
    process.exit(1);
  }

  try {
    const output = exportHarmony(hex, format);
    console.log(output);
  } catch (err) {
    console.error('Error generating harmony:', err.message);
    process.exit(1);
  }
}

module.exports = { printUsage, run };

if (require.main === module) {
  run();
}

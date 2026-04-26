#!/usr/bin/env node
// colorMixer.cli.js — CLI interface for color mixing

const { exportMixedPalette } = require('./colorMixerExporter');

function printUsage() {
  console.log(`
Usage: ember-palette mix <color1> <color2> [..colorN] [options]

Options:
  --format <json|css|scss>   Output format (default: json)
  --output <path>            Write output to file
  --help                     Show this help message

Example:
  ember-palette mix #ff0000 #0000ff --format css
`);
}

function run(argv = process.argv.slice(2)) {
  if (argv.includes('--help') || argv.length === 0) {
    printUsage();
    return;
  }

  const formatIdx = argv.indexOf('--format');
  const format = formatIdx !== -1 ? argv[formatIdx + 1] : 'json';

  const outputIdx = argv.indexOf('--output');
  const outputPath = outputIdx !== -1 ? argv[outputIdx + 1] : null;

  const colors = argv.filter((a) => !a.startsWith('--') && !/json|css|scss/.test(a) || a.startsWith('#'));
  const hexColors = colors.filter((a) => a.startsWith('#'));

  if (hexColors.length < 1) {
    console.error('Error: provide at least one hex color (e.g. #ff0000)');
    process.exit(1);
  }

  try {
    const result = exportMixedPalette(hexColors, format, outputPath);
    if (outputPath) {
      console.log(`Mixed palette written to ${outputPath}`);
    } else {
      console.log(result);
    }
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

if (require.main === module) run();

module.exports = { printUsage, run };

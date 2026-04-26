#!/usr/bin/env node

/**
 * CLI interface for browsing and managing palette history.
 * Supports listing, viewing, and clearing saved palette entries.
 */

const { readHistory, getHistoryEntry, clearHistory } = require('./paletteHistory');
const { printPalette } = require('./output');

function printUsage() {
  console.log(`
Usage: ember-palette history <command> [options]

Commands:
  list              List all saved palette entries
  view <imagePath>  View the saved palette for a specific image
  clear             Clear all palette history

Options:
  --json            Output results as JSON
  --help            Show this help message

Examples:
  ember-palette history list
  ember-palette history list --json
  ember-palette history view ./photo.jpg
  ember-palette history clear
`);
}

function formatDate(isoString) {
  const d = new Date(isoString);
  return d.toLocaleString();
}

function runList(history, asJson) {
  if (history.length === 0) {
    console.log('No palette history found.');
    return;
  }

  if (asJson) {
    console.log(JSON.stringify(history, null, 2));
    return;
  }

  console.log(`\nPalette History (${history.length} entries)\n`);
  history.forEach((entry, i) => {
    console.log(`  [${i + 1}] ${entry.imagePath}`);
    console.log(`      Saved: ${formatDate(entry.timestamp)}`);
    console.log(`      Colors: ${entry.palette.length}`);
    console.log();
  });
}

function runView(imagePath, asJson) {
  const entry = getHistoryEntry(imagePath);

  if (!entry) {
    console.error(`No history found for: ${imagePath}`);
    process.exit(1);
  }

  if (asJson) {
    console.log(JSON.stringify(entry, null, 2));
    return;
  }

  console.log(`\nPalette for: ${entry.imagePath}`);
  console.log(`Saved: ${formatDate(entry.timestamp)}\n`);
  printPalette(entry.palette);
}

function run(argv = process.argv.slice(2)) {
  const args = argv.filter(a => !a.startsWith('--'));
  const flags = argv.filter(a => a.startsWith('--'));

  const asJson = flags.includes('--json');

  if (flags.includes('--help') || args.length === 0) {
    printUsage();
    return;
  }

  const command = args[0];

  if (command === 'list') {
    const history = readHistory();
    runList(history, asJson);
  } else if (command === 'view') {
    const imagePath = args[1];
    if (!imagePath) {
      console.error('Error: view requires an image path argument.');
      printUsage();
      process.exit(1);
    }
    runView(imagePath, asJson);
  } else if (command === 'clear') {
    clearHistory();
    console.log('Palette history cleared.');
  } else {
    console.error(`Unknown command: ${command}`);
    printUsage();
    process.exit(1);
  }
}

module.exports = { printUsage, run };

if (require.main === module) {
  run();
}

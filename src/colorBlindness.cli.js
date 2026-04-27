#!/usr/bin/env node
// CLI for color blindness simulation

const { simulatePalette, TYPES } = require('./colorBlindness');

function printUsage() {
  console.log(`
Usage: ember-palette color-blindness <hex1> [hex2 ...] [--type <type>]

Simulate how a palette appears under various color blindness conditions.

Options:
  --type <type>   Limit output to one type (${TYPES.join(', ')})
  --help          Show this help message

Example:
  ember-palette color-blindness #e63946 #457b9d --type protanopia
`);
}

function run(argv = process.argv.slice(2)) {
  if (argv.includes('--help') || argv.length === 0) {
    printUsage();
    return;
  }

  const typeIndex = argv.indexOf('--type');
  let filterType = null;
  const args = [...argv];

  if (typeIndex !== -1) {
    filterType = args[typeIndex + 1];
    if (!filterType || !TYPES.includes(filterType)) {
      console.error(`Error: invalid --type. Choose from: ${TYPES.join(', ')}`);
      process.exit(1);
    }
    args.splice(typeIndex, 2);
  }

  const hexColors = args.filter(a => /^#?[0-9a-fA-F]{6}$/.test(a)).map(a => a.startsWith('#') ? a : '#' + a);

  if (hexColors.length === 0) {
    console.error('Error: provide at least one valid hex color.');
    process.exit(1);
  }

  const simulations = simulatePalette(hexColors);
  const types = filterType ? [filterType] : TYPES;

  console.log(`\nOriginal:  ${hexColors.join('  ')}`);
  console.log('─'.repeat(48));
  for (const type of types) {
    const label = type.padEnd(14);
    console.log(`${label} ${simulations[type].join('  ')}`);
  }
  console.log();
}

if (require.main === module) {
  run();
}

module.exports = { run, printUsage };

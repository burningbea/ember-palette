#!/usr/bin/env node
// CLI for auditing color palette accessibility against a background color

const { auditPalette, checkPairAccessibility } = require('./colorAccessibility');

function printUsage() {
  console.log('Usage: ember-palette accessibility <color1,color2,...> [--bg <background>]');
  console.log('       ember-palette accessibility --pair <fg> <bg>');
  console.log('Options:');
  console.log('  --bg <hex>     Background color to test against (default: #ffffff)');
  console.log('  --pair <fg> <bg>  Check a single foreground/background pair');
  console.log('  --json         Output as JSON');
}

function run(argv = process.argv.slice(2)) {
  if (!argv.length || argv.includes('--help')) {
    printUsage();
    return;
  }

  const jsonMode = argv.includes('--json');
  const pairMode = argv.includes('--pair');

  if (pairMode) {
    const idx = argv.indexOf('--pair');
    const fg = argv[idx + 1];
    const bg = argv[idx + 2];
    if (!fg || !bg) {
      console.error('Error: --pair requires two hex colors');
      process.exit(1);
    }
    const result = checkPairAccessibility(fg, bg);
    if (jsonMode) {
      console.log(JSON.stringify(result, null, 2));
    } else {
      console.log(`Foreground: ${result.foreground}  Background: ${result.background}`);
      console.log(`Contrast Ratio: ${result.ratio}:1  |  WCAG Level: ${result.level}`);
    }
    return;
  }

  const bgIdx = argv.indexOf('--bg');
  const background = bgIdx !== -1 ? argv[bgIdx + 1] : '#ffffff';
  const colorArg = argv.find((a) => !a.startsWith('--') && a !== background);

  if (!colorArg) {
    console.error('Error: provide a comma-separated list of hex colors');
    process.exit(1);
  }

  const colors = colorArg.split(',').map((c) => c.trim());
  const results = auditPalette(colors, background);

  if (jsonMode) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.log(`Accessibility audit against background ${background}:\n`);
    results.forEach((r) => {
      const status = r.passes ? '✓' : '✗';
      console.log(`  ${status} ${r.foreground}  ratio: ${r.ratio}:1  level: ${r.level}`);
    });
  }
}

module.exports = { printUsage, run };

if (require.main === module) run();

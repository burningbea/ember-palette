/**
 * cli.js - Parses CLI arguments and orchestrates palette extraction
 */

const path = require('path');
const { printPalette } = require('./output');

/**
 * Prints usage instructions to stdout
 */
function printUsage() {
  console.log(`
Usage: ember-palette <image> [options]

Options:
  -k, --colors <n>   Number of colors to extract (default: 6)
  --json             Output palette as JSON
  --no-sort          Skip luminance sorting
  -h, --help         Show this help message

Examples:
  ember-palette photo.jpg
  ember-palette banner.png --colors 8 --json
`);
}

/**
 * Parses process.argv-style argument array into an options object
 * @param {string[]} argv
 * @returns {{ imagePath: string|null, colors: number, json: boolean, sort: boolean, help: boolean }}
 */
function parseArgs(argv) {
  const args = argv.slice(2);
  const opts = {
    imagePath: null,
    colors: 6,
    json: false,
    sort: true,
    help: false
  };

  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === '-h' || arg === '--help') {
      opts.help = true;
    } else if (arg === '--json') {
      opts.json = true;
    } else if (arg === '--no-sort') {
      opts.sort = false;
    } else if ((arg === '-k' || arg === '--colors') && args[i + 1]) {
      const n = parseInt(args[++i], 10);
      if (!isNaN(n) && n > 0) opts.colors = n;
    } else if (!arg.startsWith('-') && !opts.imagePath) {
      opts.imagePath = path.resolve(arg);
    }
  }

  return opts;
}

/**
 * Entry point — runs the CLI
 * @param {string[]} argv
 */
async function runCli(argv) {
  const opts = parseArgs(argv);

  if (opts.help || !opts.imagePath) {
    printUsage();
    return;
  }

  try {
    const { extractPalette } = require('./palette');
    const palette = await extractPalette(opts.imagePath, { k: opts.colors, sort: opts.sort });
    printPalette(palette, { json: opts.json, imagePath: opts.imagePath });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}

module.exports = { printUsage, parseArgs, runCli };

#!/usr/bin/env node

/**
 * ember-palette
 * Entry point for the CLI tool.
 * Ties together argument parsing, image loading, k-means clustering,
 * color utilities, and formatted output.
 */

import { parseArgs, printUsage } from './cli.js';
import { loadImage, toHex } from './imageLoader.js';
import { extractPalette } from './palette.js';
import { sortByLuminance, getColorLabel } from './colorUtils.js';
import { printPalette } from './output.js';

async function main() {
  const args = parseArgs(process.argv.slice(2));

  if (args.help || !args.imagePath) {
    printUsage();
    process.exit(args.help ? 0 : 1);
  }

  const { imagePath, count, format, sort } = args;

  try {
    // Load pixel data from the provided image path
    const pixels = await loadImage(imagePath);

    if (!pixels || pixels.length === 0) {
      console.error('Error: Could not read any pixel data from the image.');
      process.exit(1);
    }

    // Run k-means clustering to extract dominant colors
    const palette = extractPalette(pixels, count);

    if (!palette || palette.length === 0) {
      console.error('Error: Failed to extract a color palette.');
      process.exit(1);
    }

    // Optionally sort the palette by luminance
    const finalPalette = sort ? sortByLuminance(palette) : palette;

    // Annotate each color with a human-readable label
    const annotated = finalPalette.map((color) => ({
      ...color,
      hex: toHex(color),
      label: getColorLabel(color),
    }));

    // Render the palette to stdout
    printPalette(annotated, { format });
  } catch (err) {
    console.error(`Error: ${err.message}`);
    if (process.env.DEBUG) {
      console.error(err.stack);
    }
    process.exit(1);
  }
}

main();

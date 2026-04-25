const { formatColorEntry, colorBlock } = require('./output');

const FORMATS = ['text', 'json', 'csv'];

function reportText(palette) {
  const lines = palette.map(entry => {
    const block = colorBlock(entry.hex);
    return `${block} ${formatColorEntry(entry)}`;
  });
  return lines.join('\n');
}

function reportJson(palette) {
  return JSON.stringify(palette, null, 2);
}

function reportCsv(palette) {
  const header = 'hex,label,hue,saturation,lightness,vibrant';
  const rows = palette.map(({ hex, label, hsl, vibrant }) => {
    const [h, s, l] = hsl;
    return `${hex},${label},${h},${s},${l},${vibrant ? 'true' : 'false'}`;
  });
  return [header, ...rows].join('\n');
}

function generateReport(palette, format = 'text') {
  if (!FORMATS.includes(format)) {
    throw new Error(`Unsupported format "${format}". Choose from: ${FORMATS.join(', ')}`);
  }
  switch (format) {
    case 'json': return reportJson(palette);
    case 'csv':  return reportCsv(palette);
    default:     return reportText(palette);
  }
}

module.exports = { generateReport, FORMATS };

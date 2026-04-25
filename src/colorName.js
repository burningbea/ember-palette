// Maps extracted hex colors to human-readable color names
// using basic hue/lightness bucketing from HSL values

const { rgbToHsl } = require('./colorUtils');

const HUE_NAMES = [
  { max: 15,  name: 'Red' },
  { max: 45,  name: 'Orange' },
  { max: 70,  name: 'Yellow' },
  { max: 150, name: 'Green' },
  { max: 200, name: 'Cyan' },
  { max: 260, name: 'Blue' },
  { max: 290, name: 'Violet' },
  { max: 330, name: 'Pink' },
  { max: 360, name: 'Red' },
];

function getHueName(hue) {
  for (const bucket of HUE_NAMES) {
    if (hue <= bucket.max) return bucket.name;
  }
  return 'Red';
}

function getLightnessPrefix(lightness) {
  if (lightness < 0.2) return 'Dark ';
  if (lightness > 0.75) return 'Light ';
  return '';
}

function getSaturationSuffix(saturation) {
  if (saturation < 0.15) return 'Gray';
  if (saturation < 0.35) return 'Muted ';
  return '';
}

function nameColor({ r, g, b }) {
  const [h, s, l] = rgbToHsl(r, g, b);

  const grayLabel = getSaturationSuffix(s);
  if (grayLabel === 'Gray') {
    return getLightnessPrefix(l) + 'Gray';
  }

  const prefix = getLightnessPrefix(l);
  const muted = grayLabel;
  const hue = getHueName(h);

  return `${prefix}${muted}${hue}`.trim();
}

function annotateColors(colors) {
  return colors.map((color) => ({
    ...color,
    name: nameColor(color),
  }));
}

module.exports = { getHueName, getLightnessPrefix, nameColor, annotateColors };

const { extractPalette } = require('./palette');
const { kmeans } = require('./kmeans');
const { loadImagePixels } = require('./imageLoader');

jest.mock('./imageLoader');
jest.mock('./kmeans');

const MOCK_PIXELS = [
  { r: 255, g: 0, b: 0 },
  { r: 0, g: 255, b: 0 },
  { r: 0, g: 0, b: 255 },
  { r: 255, g: 255, b: 0 },
  { r: 0, g: 255, b: 255 },
  { r: 255, g: 0, b: 255 },
];

beforeEach(() => {
  loadImagePixels.mockResolvedValue(MOCK_PIXELS);
  kmeans.mockReturnValue(MOCK_PIXELS);
});

afterEach(() => {
  jest.clearAllMocks();
});

describe('extractPalette', () => {
  test('returns an array of palette entries with hex and rgb', async () => {
    const palette = await extractPalette('fake.png', { colors: 6 });
    expect(Array.isArray(palette)).toBe(true);
    expect(palette).toHaveLength(6);
    palette.forEach((entry) => {
      expect(entry).toHaveProperty('hex');
      expect(entry).toHaveProperty('rgb');
      expect(entry.hex).toMatch(/^#[0-9a-f]{6}$/);
    });
  });

  test('palette is sorted by luminance ascending', async () => {
    const palette = await extractPalette('fake.png', { colors: 6 });
    const luminances = palette.map(
      ({ rgb }) => 0.2126 * rgb.r + 0.7152 * rgb.g + 0.0722 * rgb.b
    );
    for (let i = 1; i < luminances.length; i++) {
      expect(luminances[i]).toBeGreaterThanOrEqual(luminances[i - 1]);
    }
  });

  test('passes colors and maxIterations options to kmeans', async () => {
    await extractPalette('fake.png', { colors: 3, maxIterations: 20 });
    expect(kmeans).toHaveBeenCalledWith(MOCK_PIXELS, 3, 20);
  });

  test('throws when colors is out of range', async () => {
    await expect(extractPalette('fake.png', { colors: 0 })).rejects.toThrow(
      'colors must be between 1 and 32'
    );
    await expect(extractPalette('fake.png', { colors: 33 })).rejects.toThrow(
      'colors must be between 1 and 32'
    );
  });

  test('throws when not enough pixels for requested clusters', async () => {
    loadImagePixels.mockResolvedValue(MOCK_PIXELS.slice(0, 2));
    await expect(extractPalette('fake.png', { colors: 6 })).rejects.toThrow(
      'Not enough unique pixels'
    );
  });
});

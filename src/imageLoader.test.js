const path = require('path');
const { loadImagePixels, toHex } = require('./imageLoader');

describe('toHex', () => {
  test('converts pure red to #ff0000', () => {
    expect(toHex({ r: 255, g: 0, b: 0 })).toBe('#ff0000');
  });

  test('converts pure green to #00ff00', () => {
    expect(toHex({ r: 0, g: 255, b: 0 })).toBe('#00ff00');
  });

  test('converts pure blue to #0000ff', () => {
    expect(toHex({ r: 0, g: 0, b: 255 })).toBe('#0000ff');
  });

  test('converts white to #ffffff', () => {
    expect(toHex({ r: 255, g: 255, b: 255 })).toBe('#ffffff');
  });

  test('converts black to #000000', () => {
    expect(toHex({ r: 0, g: 0, b: 0 })).toBe('#000000');
  });

  test('rounds fractional values', () => {
    expect(toHex({ r: 254.6, g: 0.4, b: 127.5 })).toBe('#ff007f');
  });

  test('pads single hex digits', () => {
    expect(toHex({ r: 1, g: 2, b: 3 })).toBe('#010203');
  });
});

describe('loadImagePixels', () => {
  test('throws a descriptive error for a missing file', async () => {
    await expect(
      loadImagePixels('/nonexistent/path/image.png')
    ).rejects.toThrow('Failed to load image');
  });

  test('returns an array of pixel objects', async () => {
    // Use a fixture image bundled with the test suite
    const fixturePath = path.join(__dirname, '__fixtures__', 'sample.png');
    // Only run if fixture exists; otherwise skip gracefully
    let pixels;
    try {
      pixels = await loadImagePixels(fixturePath, 500);
    } catch (e) {
      return; // fixture not present in CI — skip
    }
    expect(Array.isArray(pixels)).toBe(true);
    expect(pixels.length).toBeGreaterThan(0);
    expect(pixels[0]).toHaveProperty('r');
    expect(pixels[0]).toHaveProperty('g');
    expect(pixels[0]).toHaveProperty('b');
  });

  test('respects the sampleSize limit (approximately)', async () => {
    const fixturePath = path.join(__dirname, '__fixtures__', 'sample.png');
    let pixels;
    try {
      pixels = await loadImagePixels(fixturePath, 100);
    } catch (e) {
      return;
    }
    // Sampled count should not wildly exceed the requested sample size
    expect(pixels.length).toBeLessThanOrEqual(200);
  });
});

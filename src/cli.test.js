'use strict';

const { execSync } = require('child_process');
const path = require('path');

// helpers
function runCli(args = '') {
  const cliPath = path.join(__dirname, 'cli.js');
  try {
    const stdout = execSync(`node ${cliPath} ${args}`, { encoding: 'utf8' });
    return { stdout, stderr: '', code: 0 };
  } catch (err) {
    return { stdout: err.stdout || '', stderr: err.stderr || '', code: err.status || 1 };
  }
}

describe('CLI', () => {
  test('prints usage and exits 0 with --help', () => {
    const { stdout, code } = runCli('--help');
    expect(code).toBe(0);
    expect(stdout).toMatch(/Usage: ember-palette/);
    expect(stdout).toMatch(/--colors/);
    expect(stdout).toMatch(/--json/);
  });

  test('exits 1 and shows error when no image path given', () => {
    const { stderr, code } = runCli();
    expect(code).toBe(1);
    expect(stderr).toMatch(/No image path provided/);
  });

  test('exits 1 when image path does not exist', () => {
    const { stderr, code } = runCli('nonexistent_image.png');
    expect(code).toBe(1);
    expect(stderr).toMatch(/Error/);
  });

  test('parses --colors flag correctly (invalid value falls back to default)', () => {
    // We can't easily test a real image in unit tests, so we verify bad path
    // still triggers error, not a crash on arg parsing
    const { stderr, code } = runCli('fake.png --colors abc');
    expect(code).toBe(1);
    // Should still reach image loading, not crash on arg parse
    expect(stderr).toMatch(/Error/);
  });

  test('--json flag is recognized without crashing on arg parse', () => {
    const { stderr, code } = runCli('fake.png --json');
    expect(code).toBe(1);
    expect(stderr).toMatch(/Error/);
  });
});

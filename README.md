# ember-palette

> A CLI tool that extracts perceptually harmonious color palettes from images using k-means clustering.

---

## Installation

```bash
npm install -g ember-palette
```

---

## Usage

Extract a color palette from any image file:

```bash
ember-palette extract <image> [options]
```

**Example:**

```bash
ember-palette extract photo.jpg --colors 6 --format hex
```

**Options:**

| Flag | Default | Description |
|------|---------|-------------|
| `--colors, -c` | `5` | Number of colors to extract |
| `--format, -f` | `hex` | Output format (`hex`, `rgb`, `hsl`) |
| `--output, -o` | stdout | Save palette to a JSON file |

**Sample output:**

```
#2b1d0e  #a0522d  #d4a96a  #f5deb3  #fffaf0
```

---

## Programmatic API

```js
import { extractPalette } from 'ember-palette';

const palette = await extractPalette('./photo.jpg', { colors: 5 });
console.log(palette);
// ['#2b1d0e', '#a0522d', '#d4a96a', '#f5deb3', '#fffaf0']
```

---

## Contributing

Pull requests are welcome. For major changes, please open an issue first to discuss what you would like to change.

---

## License

[MIT](./LICENSE)
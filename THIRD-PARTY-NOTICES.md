# Third-Party Notices

Sheets Quest bundles the following third-party packages into its production
build. Each is distributed under its own license, reproduced or linked below.
These licenses apply to the respective packages only — not to Sheets Quest
itself, which is copyright © 2026 [RSHamilton](https://github.com/rshamilton)
and licensed under [CC BY-NC-SA 4.0](LICENSE.md).

## Bundled at runtime

| Package | License | Project |
| --- | --- | --- |
| [react](https://react.dev/) | MIT | © Meta Platforms, Inc. and affiliates |
| [react-dom](https://react.dev/) | MIT | © Meta Platforms, Inc. and affiliates |
| [exceljs](https://github.com/exceljs/exceljs) | MIT | © Guyon Roche |
| [file-saver](https://github.com/eligrey/FileSaver.js) | MIT | © Eli Grey |
| [lucide-react](https://lucide.dev) | ISC | © Lucide Contributors |
| [motion](https://motion.dev) | MIT | © Motion (Framer) |
| [tailwindcss](https://tailwindcss.com) | MIT | © Tailwind Labs, Inc. |

Fonts (Inter, JetBrains Mono) are loaded from Google Fonts and are licensed
under the [SIL Open Font License 1.1](https://openfontlicense.org/).

## Build-time only (not shipped)

| Package | License |
| --- | --- |
| [vite](https://vite.dev) | MIT |
| [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react) | MIT |
| [@tailwindcss/vite](https://tailwindcss.com) | MIT |
| [typescript](https://www.typescriptlang.org/) | Apache-2.0 |

## MIT License

The MIT-licensed packages above are distributed under the following terms:

```
Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
```

## ISC License

```
Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted, provided that the above
copyright notice and this permission notice appear in all copies.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
```

To regenerate the dependency list, run `npm ls --omit=dev --depth=0`.

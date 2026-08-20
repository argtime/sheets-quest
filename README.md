# Sheets Quest

[![Build](https://github.com/rshamilton/sheetsquest/actions/workflows/build.yml/badge.svg)](https://github.com/rshamilton/sheetsquest/actions/workflows/build.yml)
[![License: CC BY-NC-SA 4.0](https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg)](LICENSE.md)

**Sheets Quest** turns pixel art images into interactive, quiz-style spreadsheets for students. Students type answers to questions and watch a hidden pixel art picture reveal itself — making review and practice more engaging.

The generated `.xlsx` files work in both **Microsoft Excel** and **Google Sheets**.

**➡️ Try it now: [rshamilton.github.io/sheetsquest](https://rshamilton.github.io/sheetsquest/)** — free, no account, no install.

---

## Features

- 📷 **Upload any pixel art image** — the app processes it into a pixel grid automatically.
- ❓ **Add Q&A pairs** — each correct answer reveals a portion of the hidden image.
- ✅ **Smart answer checking** — optionally ignore capitalization, extra spaces, or accents.
- ✏️ **Custom instructions** — add your own instructions line to the generated sheet.
- 🎨 **Color-reveal via conditional formatting** — works in Excel and Google Sheets.
- 💾 **Work is saved locally** — your questions stay in the browser between visits.
- 🔒 **Client-side generation** — images, questions, and answers never leave your device.

---

## How to Use

1. **Upload a pixel art image** — click the image upload area and choose a pixel art file. Smaller, high-contrast images with clearly distinct colors work best. Images up to 10 MB are accepted and are downscaled to an 80 px grid.
2. **Add your questions & answers** — type questions and their correct answers in the panel on the right. Each correct answer will unlock a portion of the hidden picture. Up to 40 questions per sheet.
3. **Add custom instructions** *(optional)* — enter a custom instructions message that will appear at the top of the generated sheet.
4. **Adjust settings** *(optional)* — use the Settings panel to choose whether to ignore capitalization, extra spaces, or accents when checking answers.
5. **Download your sheet** — click **Download** to generate and download an `.xlsx` file ready to share with students.

### Opening in Google Sheets

After downloading your `.xlsx` file:

1. Go to [sheets.google.com](https://sheets.google.com) and open a blank spreadsheet.
2. Click **File** → **Import**.
3. Select the **Upload** tab and choose your downloaded `.xlsx` file.
4. Choose **Replace spreadsheet** or **Insert new sheet(s)**, then click **Import data**.
5. Share the link with your students — they can type answers to reveal the pixel art!

> **Note:** Allow editing when opening the file so the formulas and conditional formatting can run.

### Browser support

Any current version of Chrome, Edge, Firefox, or Safari. JavaScript is required; the build targets ES2022.

---

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) v20 or later (see [`.nvmrc`](.nvmrc))
- npm

### Getting Started

```bash
git clone https://github.com/rshamilton/sheetsquest.git
cd sheetsquest
npm install     # install dependencies
npm run dev     # start the dev server on http://localhost:3000
```

### Scripts

| Command | What it does |
| --- | --- |
| `npm run dev` | Start the Vite dev server on port 3000 |
| `npm run build` | Production build into `dist/` |
| `npm run preview` | Serve the production build locally |
| `npm run lint` | TypeScript type-check (`tsc --noEmit`, strict mode) |
| `npm run clean` | Remove `dist/` |

Run `npm run lint && npm run build` before opening a pull request — CI runs exactly these.

### Project structure

```
├── index.html                 # App shell, SEO/Open Graph tags, analytics
├── public/                    # Static assets copied verbatim (favicon, robots.txt, …)
├── src/
│   ├── main.tsx               # React entry point
│   ├── App.tsx                # UI: upload, questions, settings, modals
│   ├── index.css              # Tailwind entry + theme tokens
│   └── utils/
│       ├── pixelProcessor.ts  # Image → pixel grid (canvas, client-side)
│       └── sheetGenerator.ts  # Pixel grid + Q&A → .xlsx (ExcelJS)
├── vite.config.ts             # Vite config; `base` must match the Pages subpath
└── .github/workflows/build.yml  # CI: type-check, build, deploy to GitHub Pages
```

### Tech stack

[React 19](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vite.dev/), [Tailwind CSS v4](https://tailwindcss.com/), [ExcelJS](https://github.com/exceljs/exceljs), [Motion](https://motion.dev), and [Lucide](https://lucide.dev) icons.

`sheetGenerator.ts` (and with it ExcelJS, the largest dependency) is loaded on demand at download time, so it is not part of the initial page load.

---

## Deployment

The app is fully static. Pushes to `main` are built and published to GitHub Pages automatically by [`.github/workflows/build.yml`](.github/workflows/build.yml). See [DEPLOYMENT.md](DEPLOYMENT.md) for details, including how to host it elsewhere.

---

## Contributing

Contributions are welcome — see [CONTRIBUTING.md](CONTRIBUTING.md) for how to report bugs, request features, and submit pull requests. Participation is covered by our [Code of Conduct](CODE_OF_CONDUCT.md).

To report a security issue, please follow [SECURITY.md](SECURITY.md) rather than opening a public issue.

---

## Support

- **Email:** [sheetsquest@googlegroups.com](mailto:sheetsquest@googlegroups.com)
- **Bug reports & feature requests:** [Open an issue on GitHub](https://github.com/rshamilton/sheetsquest/issues)
- **Feedback form:** Use the **Feedback** link at the bottom of the website.

---

## Privacy

Images, questions, and answers are processed entirely in your browser and are never uploaded. The site uses Google Tag Manager for anonymized usage analytics, stores your work in your browser's local storage, and — only if you submit the optional feedback form — sends that form's contents to [Formspree](https://formspree.io/legal/privacy-policy/). Full details are in the **Privacy** dialog in the app footer.

---

## License

Copyright © 2026 [rshamilton](https://github.com/rshamilton). Sheets Quest is licensed under [CC BY-NC-SA 4.0](LICENSE.md) (Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International).

**You may** use, share, and adapt the project freely — in classrooms, at home, in workshops, anywhere — as long as you credit the author, link to the license, note any changes you made, and release your adaptations under these same terms.

**You may not** make money from it. That covers selling it, selling a modified version, bundling it into a paid product or service, and putting it behind a paywall.

**Sheets you create are yours.** The license covers Sheets Quest itself — not the questions, answers, images, or `.xlsx` files you produce with it. Share those however you like.

Bundled dependencies keep their own (permissive) licenses — see [THIRD-PARTY-NOTICES.md](THIRD-PARTY-NOTICES.md).

### How to credit

If you share or adapt Sheets Quest, include a line like this somewhere a reader can find it:

```
Sheets Quest by rshamilton (https://github.com/rshamilton), used under
CC BY-NC-SA 4.0. Source: https://github.com/rshamilton/sheetsquest
```

An HTML version is in [LICENSE.md](LICENSE.md). If you changed something, add "Modified from the original."

> **Two notes.** CC BY-NC-SA 4.0 is not an OSI-approved open-source license, because "no commercial use" is incompatible with the open-source definition. As a result GitHub's license detector cannot identify it and the sidebar will read "Other" — that is true of *every* non-commercial license, not a problem with this one. Contributions are accepted on the understanding that they carry these same terms.

© 2026 rshamilton

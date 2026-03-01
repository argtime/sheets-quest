# Sheets Quest

**Sheets Quest** turns pixel art images into interactive, quiz-style spreadsheets for students. Students type answers to questions and watch a hidden pixel art picture reveal itself — making review and practice more engaging!

The generated `.xlsx` files work in both **Microsoft Excel** and **Google Sheets**.

---

## Features

- 📷 **Upload any pixel art image** — the app processes it into a pixel grid automatically.
- ❓ **Add Q&A pairs** — each correct answer reveals a portion of the hidden image.
- ✅ **Smart answer checking** — optionally ignore capitalization, extra spaces, or accents.
- ✏️ **Custom instructions** — add your own instructions line to the generated sheet.
- 🎨 **Color-reveal via conditional formatting** — works in Excel and Google Sheets.
- 🔒 **100% client-side** — no data ever leaves your device.

---

## How to Use

1. **Upload a pixel art image** — click the image upload area and choose a pixel art file. Smaller, high-contrast images with clearly distinct colors work best.
2. **Add your questions & answers** — type questions and their correct answers in the panel on the right. Each correct answer will unlock a portion of the hidden picture.
3. **Add custom instructions** *(optional)* — enter a custom instructions message that will appear at the top of the generated sheet.
4. **Adjust settings** *(optional)* — use the Settings panel to choose whether to ignore capitalization, extra spaces, or accents when checking answers.
5. **Download your sheet** — click **Download Sheet** to generate and download an `.xlsx` file ready to share with students.

---

## Opening in Google Sheets

After downloading your `.xlsx` file:

1. Go to [sheets.google.com](https://sheets.google.com) and open a blank spreadsheet.
2. Click **File** → **Import**.
3. Select the **Upload** tab and choose your downloaded `.xlsx` file.
4. Choose **Replace spreadsheet** or **Insert new sheet(s)**, then click **Import data**.
5. Share the link with your students — they can type answers to reveal the pixel art!

> **Note:** Allow editing when opening the file so the formulas and conditional formatting can run.

---

## Development

### Prerequisites

- [Node.js](https://nodejs.org/) (v18 or later)
- npm

### Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

The app is built with [React](https://react.dev/), [TypeScript](https://www.typescriptlang.org/), [Vite](https://vitejs.dev/), and [Tailwind CSS](https://tailwindcss.com/).

---

## License & Usage

Content created with this tool is **free to distribute** but **cannot be sold**. Modifications are permitted but cannot be sold or used for commercial content.

© 2026 Sheets Quest. All rights reserved.

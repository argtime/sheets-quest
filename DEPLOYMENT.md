# Deployment & Contributing

This document covers how to deploy Sheets Quest, report issues, and contribute code.

---

## Deployment

### Prerequisites

- [Node.js](https://nodejs.org/) v18 or later
- npm

### Build

```bash
# Install dependencies
npm install

# Build for production (outputs to dist/)
npm run build

# Preview the production build locally
npm run preview
```

The app is fully static — the contents of the `dist/` folder can be served from any static hosting service (GitHub Pages, Netlify, Vercel, etc.).

### GitHub Pages

This project is configured to deploy automatically via GitHub Actions when changes are pushed to the `main` branch. See [`.github/workflows/build.yml`](.github/workflows/build.yml) for details.

---

## Reporting Issues

Found a bug or have a feature request? We'd love to hear from you.

### Option 1 — GitHub Issues (preferred)

1. Go to the [Issues page](https://github.com/argtime/sheets-quest/issues).
2. Click **New issue**.
3. Choose the appropriate template (Bug report or Feature request).
4. Fill in as much detail as possible — steps to reproduce, expected vs. actual behavior, screenshots, etc.
5. Submit the issue.

> Issues are the best way to track bugs and feature requests because they're public, searchable, and let the community upvote and discuss them.

### Option 2 — Feedback form

Use the **Send Feedback** button at the bottom of the website to submit a bug report, feature request, or general message directly.

### Option 3 — Email

For private inquiries, contact us at [sheetsquest@googlegroups.com](mailto:sheetsquest@googlegroups.com).

---

## Contributing Code

We welcome pull requests! Please keep the following in mind:

1. **Open an issue first.** Before writing code, open a GitHub issue describing the problem or feature. This lets us discuss the approach and avoid duplicated effort.

2. **Fork and branch.** Fork the repository and create a descriptive branch (e.g., `fix/image-upload-crash` or `feat/dark-mode`).

3. **Keep changes focused.** A pull request should address one issue or feature. Smaller PRs are easier to review and more likely to be merged.

4. **Test your changes.** Run `npm run lint` and `npm run build` before submitting to make sure nothing is broken.

5. **Submit the pull request.** Open a PR against the `main` branch with a clear description of what you changed and why, referencing the related issue (e.g., `Closes #42`).

> **Important:** Submitting a pull request does **not** guarantee that it will be accepted. We review all contributions, but may decline them for reasons such as scope, design direction, or maintenance burden. We appreciate your effort regardless!

---

## Code Style

- TypeScript with strict mode enabled
- React functional components with hooks
- Tailwind CSS for styling
- Run `npm run lint` (TypeScript type-check) before committing

---

© 2026 Sheets Quest. All rights reserved.

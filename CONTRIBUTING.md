# Contributing to Sheets Quest

Thanks for your interest in improving Sheets Quest! This document covers reporting bugs, requesting features, and submitting code.

By participating in this project you agree to abide by our [Code of Conduct](CODE_OF_CONDUCT.md).

> **Security issues:** please do **not** open a public issue. Follow [SECURITY.md](SECURITY.md) instead.

---

## Reporting Issues

### Option 1 — GitHub Issues (preferred)

1. Search the [existing issues](https://github.com/rshamilton/sheetsquest/issues) first — someone may have already reported it.
2. Go to the [Issues page](https://github.com/rshamilton/sheetsquest/issues) and click **New issue**.
3. Choose the appropriate template (Bug report or Feature request).
4. Fill in as much detail as possible — steps to reproduce, expected vs. actual behavior, browser and OS, screenshots, and (for sheet problems) whether you opened the file in Excel or Google Sheets.

> Issues are the best way to track bugs and feature requests because they're public, searchable, and let the community upvote and discuss them.

### Option 2 — Feedback form

Use the **Feedback** link at the bottom of the website to submit a bug report, feature request, or general message directly.

### Option 3 — Email

For private inquiries, contact us at [sheetsquest@googlegroups.com](mailto:sheetsquest@googlegroups.com).

---

## Contributing Code

### Before you start

**Open an issue first.** Before writing code, open a GitHub issue describing the problem or feature. This lets us discuss the approach and avoid duplicated effort.

### Development setup

```bash
git clone https://github.com/rshamilton/sheetsquest.git
cd sheetsquest
npm install
npm run dev     # http://localhost:3000
```

Node.js v20 or later is required (see [`.nvmrc`](.nvmrc)).

### Workflow

1. **Fork and branch.** Fork the repository and create a descriptive branch (e.g., `fix/image-upload-crash` or `feat/dark-mode`).

2. **Keep changes focused.** A pull request should address one issue or feature. Smaller PRs are easier to review and more likely to be merged.

3. **Check your work.** Run both of these before submitting — CI runs exactly the same commands and will fail the PR otherwise:

   ```bash
   npm run lint     # tsc --noEmit, strict mode
   npm run build
   ```

4. **Test the generated sheet.** If your change touches `src/utils/sheetGenerator.ts` or `src/utils/pixelProcessor.ts`, download an `.xlsx` and confirm it still works in **both** Excel and Google Sheets — the two render conditional formatting differently, and a change that looks fine in one can break the other.

5. **Submit the pull request.** Open a PR against `main` with a clear description of what you changed and why, referencing the related issue (e.g., `Closes #42`). Include before/after screenshots for UI changes.

> **Important:** Submitting a pull request does **not** guarantee that it will be accepted. We review all contributions, but may decline them for reasons such as scope, design direction, or maintenance burden. We appreciate your effort regardless!

---

## Code Style

- TypeScript with `strict` mode enabled — no `any` escapes, no `@ts-ignore` without a comment explaining why.
- React function components with hooks. No class components.
- Tailwind CSS utility classes for styling; keep the emerald/slate palette used throughout.
- Keep the app **client-side only**. Sheets Quest makes no server calls to generate sheets, and user images, questions, and answers must never be transmitted anywhere. A change that adds a network round-trip for core functionality will not be accepted.
- Preserve accessibility: labelled form controls, keyboard-reachable buttons, visible focus rings, and `aria-*` attributes on dialogs.

---

## Licensing of Contributions

Sheets Quest is copyright © 2026 [rshamilton](https://github.com/rshamilton) and licensed under [CC BY-NC-SA 4.0](LICENSE.md). By submitting a pull request you agree that your contribution is licensed under those same terms, and that you have the right to grant that license.

Note that CC BY-NC-SA 4.0 is not an OSI-approved open-source license: it prohibits commercial use and requires adaptations to be shared alike. Please make sure you're comfortable with that before contributing.

Contributors are credited through the Git history and the repository's contributors list. Please don't add yourself to the copyright notice in `LICENSE.md`.

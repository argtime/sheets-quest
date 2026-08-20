# Security Policy

## Supported Versions

Sheets Quest is a single static web app deployed continuously from `main` to
<https://argtime.github.io/sheetsquest/>. Only the currently deployed version is
supported; fixes ship by deploying a new build rather than by patching releases.

| Version | Supported |
| --- | --- |
| Deployed `main` | ✅ |
| Older commits / forks | ❌ |

## Reporting a Vulnerability

**Please do not report security vulnerabilities through public GitHub issues, the
in-app feedback form, or social media.**

Instead, report privately using either of the following:

1. **GitHub Security Advisories (preferred)** — open a draft advisory at
   <https://github.com/argtime/sheetsquest/security/advisories/new>.
2. **Email** — [sheetsquest@googlegroups.com](mailto:sheetsquest@googlegroups.com)
   with `SECURITY` in the subject line.

Please include:

- A description of the issue and its potential impact.
- Steps to reproduce, ideally with a minimal proof of concept.
- The browser and version you tested with.
- Whether the issue is already public anywhere.

### What to expect

- **Acknowledgement** within 5 business days.
- **An initial assessment** (confirmed / not reproducible / out of scope) within 10 business days.
- **A fix deployed** for confirmed issues as quickly as practical, given this is a volunteer-maintained project.
- **Credit** in the advisory and release notes, unless you ask to stay anonymous.

Please give us a reasonable opportunity to fix the issue before disclosing it publicly.

## Scope

Sheets Quest runs entirely in the browser. It has no backend, no user accounts,
no database, and no server-side storage of user content. Images, questions, and
answers are processed locally and never transmitted.

**In scope:**

- Cross-site scripting or content injection in the app UI.
- Malicious content injected into a generated `.xlsx` file (for example, formula
  injection reachable through question or answer text).
- Anything that causes user content to leave the browser unexpectedly.
- Supply-chain issues in the dependencies listed in `package.json`.
- Misconfiguration of the GitHub Pages deployment or the release workflow.

**Out of scope:**

- Vulnerabilities in Microsoft Excel or Google Sheets themselves.
- Issues in third-party services we merely link to or embed
  (Google Tag Manager, Formspree, Google Fonts, GitHub Pages). Report those to
  the respective vendor.
- Missing security headers that cannot be set on GitHub Pages static hosting.
- Denial of service achieved by uploading an enormous image to your own browser.
- Automated scanner output without a demonstrated, reachable impact.

## Third-Party Services

The deployed site loads or contacts:

| Service | Purpose |
| --- | --- |
| GitHub Pages | Static hosting |
| Google Tag Manager | Anonymized usage analytics |
| Google Fonts | Inter and JetBrains Mono webfonts |
| Formspree | Delivers the optional feedback form (only on submit) |

No other network requests are made during normal use.

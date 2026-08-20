# Deployment

How to build and deploy Sheets Quest. For bug reports, feature requests, and
code contributions, see [CONTRIBUTING.md](CONTRIBUTING.md).

---

## Prerequisites

- [Node.js](https://nodejs.org/) v20 or later (see [`.nvmrc`](.nvmrc))
- npm

## Build

```bash
npm ci          # install exactly what package-lock.json specifies
npm run lint    # type-check (tsc --noEmit, strict)
npm run build   # production build into dist/
npm run preview # serve the production build locally
```

The app is fully static — there is no backend and no runtime configuration. The
contents of `dist/` can be served from any static host (GitHub Pages, Netlify,
Vercel, Cloudflare Pages, or a plain web server).

---

## GitHub Pages (current deployment)

The site is deployed to <https://rshamilton.github.io/sheetsquest/>.

Pushes to `main` are built and published automatically by
[`.github/workflows/build.yml`](.github/workflows/build.yml). The workflow:

1. Type-checks and builds on every push and pull request to any branch.
2. On `main` only, uploads `dist/` as a Pages artifact and deploys it.

### One-time repository setup

- **Settings → Pages → Source:** set to **GitHub Actions** (not "Deploy from a branch").
- **Settings → Environments → `github-pages`:** restrict deployments to the `main` branch.

### The `base` path

`vite.config.ts` sets `base: '/sheetsquest/'`, which must match the path the site
is served from. Getting this wrong produces a blank page with 404s for the JS and
CSS bundles.

| Where it's hosted | `base` value |
| --- | --- |
| `rshamilton.github.io/sheetsquest/` (project page) | `'/sheetsquest/'` |
| A custom domain, or a user/org page at the root | `'/'` |

Root-relative asset paths in `index.html` (such as the favicon) are rewritten
with `base` automatically at build time, so they need no change. What *does*
need updating by hand when the URL changes:

- the absolute URLs in `public/robots.txt` and `public/sitemap.xml`
- the `canonical`, `og:url`, `og:image`, and `twitter:image` tags in `index.html`
- `homepage` in `package.json`

---

## Hosting elsewhere

```bash
npm ci
npm run build
# then upload the contents of dist/
```

Set `base` to `'/'` in `vite.config.ts` if the app is served from the root of a
domain. Because it's a single page with no client-side routing, no SPA rewrite
rule is needed.

### Recommended response headers

GitHub Pages does not let you set custom headers. On a host that does, these are
worth adding:

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src https://fonts.gstatic.com; img-src 'self' data: blob: https://www.googletagmanager.com; connect-src 'self' https://formspree.io https://*.google-analytics.com; frame-src https://www.googletagmanager.com; object-src 'none'; base-uri 'self'
Strict-Transport-Security: max-age=63072000; includeSubDomains; preload
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
Permissions-Policy: camera=(), microphone=(), geolocation=(), interest-cohort=()
```

Verify the CSP against the app before enforcing it — Google Tag Manager and the
Formspree form endpoints are the parts most likely to need adjustment.

---

## Deployment checklist

- [ ] `npm run lint` and `npm run build` pass locally
- [ ] `base` in `vite.config.ts` matches the deployment path
- [ ] Favicon, `robots.txt`, and `sitemap.xml` URLs match the deployment domain
- [ ] Open the deployed site, upload an image, and download a sheet
- [ ] Open that sheet in **both** Excel and Google Sheets
- [ ] Check the browser console for errors

---

© 2026 [RSHamilton](https://github.com/rshamilton). Licensed under [CC BY-NC-SA 4.0](LICENSE.md).

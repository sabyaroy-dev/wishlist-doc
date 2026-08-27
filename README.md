# Lonigma Wishlist Documentation

Static documentation for **Lonigma Wishlist**, a Shopify wishlist application. The repository contains a merchant-facing Help Centre and a separate technical developer runbook.

The site is built with plain HTML, CSS, JavaScript, and image assets. It does not require a framework, package installation, or build step.

## Documentation sites

- [Merchant Help Centre](index.html) — installation, theme setup, display modes, branding, sharing, alerts, analytics, Klaviyo, plans, troubleshooting, and privacy.
- [Developer Guide](developer-guide.html) — architecture, local setup, Shopify CLI, database work, app proxies, theme extensions, webhooks, workers, testing, security, and deployment.
- [Published documentation](https://sabyaroy-dev.github.io/wishlist-doc/#introduction)

## Project structure

```text
wishlist-doc/
├── index.html
├── developer-guide.html
├── assets/
│   ├── css/
│   │   ├── styles.css
│   │   └── developer-guide.css
│   ├── js/
│   │   ├── search.js
│   │   └── developer-guide.js
│   └── images/
└── README.md
```

## Run locally

Open `index.html` directly in a browser:

```text
file:///path/to/wishlist-doc/index.html
```

Alternatively, serve the directory with any static HTTP server. For example:

```bash
npx serve .
```

No dependency installation is required for the documentation itself.

## Navigation

Both documents use URL hashes, so individual pages can be linked directly:

```text
index.html#install-and-set-up
index.html#klaviyo
developer-guide.html#first-time-setup
developer-guide.html#notifications-klaviyo-and-alerts
```

The merchant Help Centre includes searchable documentation. The developer guide includes active navigation, light and dark themes, copyable code blocks, section descriptions, and Previous/Next controls.

## Responsive behavior

Both sites support desktop, tablet, and phone layouts. On small screens:

- navigation opens as an off-canvas sidebar;
- tables and code examples scroll horizontally when required;
- images scale within the available width;
- Previous and Next controls use a compact layout.

## Editing the documentation

1. Update content in `index.html` or `developer-guide.html`.
2. Keep shared styling in the appropriate file under `assets/css/`.
3. Keep interactive behavior in the appropriate file under `assets/js/`.
4. Store documentation images in `assets/images/` and use descriptive filenames and alt text.
5. Do not add framework or build-tool dependencies unless the project requirements change.

When adding screenshots, remove or mask API keys, passwords, email addresses, customer identifiers, and other private information.

## Verification

Before publishing changes:

- open both HTML files and check every affected hash route;
- verify desktop and phone navigation;
- test search, theme switching, code-copy buttons, and Previous/Next navigation;
- confirm tables and images remain readable in light and dark themes;
- run `git diff --check` to catch whitespace errors.

## Deployment

The repository can be published directly with GitHub Pages:

1. Push changes to the repository's publishing branch.
2. In GitHub, open **Settings → Pages**.
3. Select deployment from the branch and repository root.
4. Verify the published Help Centre and Developer Guide after deployment.

Because this is a static project, GitHub Pages serves the files without a build workflow.

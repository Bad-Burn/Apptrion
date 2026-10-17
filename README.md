# Apptrion Website

Marketing site for Apptrion, a software product studio. It is a single static page (HTML, CSS and vanilla JavaScript, no build step) with an optional Node.js server that handles contact form submissions.

## Project structure

```
Apptrion Company/
├── index.html              # The whole page: header, hero, about, work, process, team, contact, footer
├── css/
│   └── styles.css          # Design tokens, layout, components, product mockups, responsive rules
├── js/
│   └── main.js             # Theme toggle, mobile menu, scroll effects, contact form
├── assets/img/
│   ├── favicon.svg         # Logo mark, adapts to the browser's light/dark setting
│   ├── apple-touch-icon.png
│   ├── og-image.png        # Social sharing preview
│   └── team/               # Optimized founder portraits (WebP)
├── server.js               # Express server: serves the site and POST /api/contact
├── package.json
└── .env.example            # Email settings for the contact form
```

## Running locally

Open `index.html` directly in a browser, or run the server:

```bash
npm install
npm start          # http://localhost:3000
```

## Contact form

The form validates input in the browser, then posts JSON to `/api/contact`.

- **With the Node server** (`npm start`): submissions are logged to the console and, when email is configured, sent to `CONTACT_EMAIL` with the visitor's address as reply-to.
- **On static hosting** (GitHub Pages) or when `index.html` is opened as a file, there is no API. The form detects this and opens the visitor's email app with the message filled in, addressed to the email in the form's `data-fallback-email` attribute.

To enable email from the server, copy `.env.example` to `.env` and fill in:

```
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-specific-password
CONTACT_EMAIL=where-submissions-go@example.com
```

Gmail requires 2-Step Verification and an app-specific password.

## Design notes

- **Brand colours** come from the logo: ink `#0e0e0f` and red `#920303` (a brighter `#e5484d` / `#f0524f` is used in dark mode for contrast). All colours are CSS custom properties at the top of `styles.css`.
- **Type**: Geist and Geist Mono from Google Fonts.
- **Theme**: follows the visitor's system setting until they use the toggle; the choice is saved in `localStorage` under `theme`.
- **Logo**: drawn as an inline SVG symbol (`#apptrion-mark`) so it can switch colours with the theme. The hero graphic is the same mark shown on its equilateral construction grid.
- **Product previews** in the Work section are built in HTML/CSS (no screenshots), so they stay sharp and follow the theme. Replace them with real screenshots when available.
- **Motion** is limited to fade-in on scroll and the hero drawing, and is disabled for visitors who prefer reduced motion.

## Deployment

Pushing to `main` deploys the site to GitHub Pages via `.github/workflows/static.yml`.

# thewardesk.com/studiodeck · the sales deck as an unlisted page

Static, self-contained: `index.html` (deck, fonts and imagery inlined) plus `reel.mp4` (the showreel it streams). Already placed at `wardesk/public/studiodeck/` with a rewrite added to `next.config.mjs` (`/studiodeck` → `/studiodeck/index.html`). Push and Vercel serves it.

Nothing else was touched. The production middleware already lets this path through (its `/studio` prefix allowlist covers `/studiodeck`), and `/studiodeck/reel.mp4` passes the static-asset rule.

## Intent: unlisted, not secret

No links from nav, footer, landing, or sitemap. `index.html` carries `noindex, nofollow`. The "request deck" email capture on the site stays the public front door; this URL is what gets sent after a request or directly to a prospect.

## Verify after deploy

1. thewardesk.com/studiodeck in a private window: deck centers at any window size, arrow keys change slides.
2. Slide 2 play button: reel starts fast and scrubs freely (mp4 streams with range requests).
3. thewardesk.com/studiodeck/reel.mp4 plays directly. This raw URL is also the ideal target for the PDF's clickable play button.

## Updating later

New reel cut: replace `public/studiodeck/reel.mp4`. New deck: replace `public/studiodeck/index.html`. Push. Done.

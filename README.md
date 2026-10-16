# Juje Hsiung — Portfolio

A one-page fashion portfolio (Editorial · Commercial · Menswear) plus films, an index, Instagram and contact.

## How to change things (no code needed)

Open `site/assets/js/data.js` in any text editor. Everything you'll want to change is there:

- **Films / music videos** — add a title, credit and poster image. Put your video file in `site/assets/video/` and set `"src": "assets/video/your-file.mp4"`.
- **Index list** — the project names, category and year shown near the bottom.
- **Instagram grid** — the preview images shown in the Instagram strip (the handle links to your live profile).

To change the photos in the main sections, open `site/index.html` and replace the image URL between `src="..."` with a link to your new photo (or drop files into `site/assets/img/` and use `assets/img/your-file.jpg`).

## Preview locally

Open `site/index.html` in any browser — no build step required.

## Deploy

This folder is the site. Push it to GitHub and connect the repo to Vercel; Vercel serves it as a static site.

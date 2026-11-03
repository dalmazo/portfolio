# Rafael Dalmazo — Portfolio

Blog-like portfolio built from Markdown files. See [PORTFOLIO_RULES.md](./PORTFOLIO_RULES.md)
for the full conventions.

## Develop

On Windows, double-click `run-local.bat` to start the dev server and open the
site at http://localhost:3000. Or use the commands below:

```bash
npm install
npm run dev
```

Open http://localhost:3000.

## Add content

Add a `.md` file to `posts/` or `notes/` with front-matter:

```md
---
title: "My Project"
date: "2026-09-23"
type: "project"   # about | project | blog | contact
summary: "One-line description shown in listings."
cover: "/images/my-project.png"   # optional card image or .mp4 video
order: 6                          # optional, projects only
---

Body content here.
```

No code changes needed — the site picks it up automatically. See
[PORTFOLIO_RULES.md](./PORTFOLIO_RULES.md) for all front-matter fields.

Use `posts/` for projects (`project`, shown at `/projects/<slug>`), and
`notes/` for writing (`blog`). Notes are listed at `/blog` and are available at
`/notes/<slug>`.

## Add a flowchart

Describe the flow in plain English and ask your coding assistant to turn it into a
` ```mermaid ` code block inside your `.md` file. It renders as a diagram.

## Build & deploy

```bash
npm run build
```

Produces a static export in `out/`. Pushing to `main` triggers
[.github/workflows/deploy.yml](./.github/workflows/deploy.yml), which builds
and publishes to GitHub Pages automatically.

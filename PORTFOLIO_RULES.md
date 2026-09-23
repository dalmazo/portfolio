# Portfolio Rules

Source of truth for how this portfolio site works and is maintained.

## Rule 1 — Content-driven pages
All pages (About, Projects, Blog posts, Contact) are generated from Markdown files
in the `posts/` folder. Each file needs YAML front-matter:

```md
---
title: "My Project"
date: "2026-09-23"
type: "project"   # one of: about | project | blog | contact
summary: "One-line description shown in listings."
---

Body content in Markdown/MDX goes here.
```

Adding a new page = adding a new `.md` file to `posts/`. No code changes required.

## Rule 2 — Simple dark/white theme
- Two themes only: dark and light. No extra color schemes.
- Minimal typography-focused layout (Tailwind `prose` classes), no heavy UI library.
- A toggle in the header switches themes; preference is saved in `localStorage` and
  falls back to the OS `prefers-color-scheme` on first visit.

## Rule 3 — Flowcharts without hand-writing diagram syntax
Diagrams are authored as [Mermaid](https://mermaid.js.org/) code blocks, but you never
have to write Mermaid syntax by hand:

1. In a post, describe the flow in plain English (e.g. as a comment or a request to
   the assistant): "user logs in, then checks token, if valid go to dashboard else
   show error".
2. Ask Copilot to turn that description into a Mermaid diagram. Copilot writes a
   fenced code block into the `.md` file:

   ````md
   ```mermaid
   flowchart TD
     A[User logs in] --> B{Token valid?}
     B -->|Yes| C[Dashboard]
     B -->|No| D[Show error]
   ```
   ````

3. The site's Markdown renderer detects ` ```mermaid ` code blocks and renders them
   as an actual diagram (via the `mermaid` client-side library) instead of plain text.

This is an authoring-time convention — there is no runtime AI call in the deployed
site, keeping it fully static and free to host.

### Embedding YouTube videos

Drop a fenced code block tagged `youtube` containing the video's URL (or bare
11-character video ID):

````md
```youtube
https://www.youtube.com/watch?v=dQw4w9WgXcQ
```
````

The renderer replaces it with a responsive, privacy-enhanced (`youtube-nocookie.com`)
embedded player.

### Embedding local video files

Put the video file in `public/videos/` and reference it with a fenced `video`
code block:

````md
```video
/videos/my-clip.mp4
```
````

The renderer replaces it with an HTML5 `<video controls>` player.

## Rule 4 — Easy to maintain, hosted on GitHub Pages
- Stack: Next.js (App Router, TypeScript) with static export (`output: 'export'`).
- No backend/server, no database — everything is static files + Markdown.
- Deployed as a GitHub Pages **project page** at `https://<username>.github.io/portfolio`,
  via a GitHub Actions workflow that builds on every push to `main` and publishes the
  static export automatically.
- To publish a new post: add/edit a `.md` file in `posts/`, commit, push — the site
  rebuilds and deploys itself.

## Tech stack summary
| Concern           | Choice                                   |
|-------------------|-------------------------------------------|
| Framework         | Next.js (App Router, TypeScript, static export) |
| Styling           | Tailwind CSS                              |
| Content           | Markdown/MDX files in `posts/` + front-matter |
| Diagrams          | Mermaid, authored via plain-English prompt to Copilot |
| Theme             | Dark/white toggle, localStorage + OS fallback |
| Hosting           | GitHub Pages (project page), GitHub Actions deploy |

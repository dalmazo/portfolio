---
title: "Welcome to my portfolio blog"
date: "2026-09-23"
type: "blog"
summary: "How this site works: markdown-driven pages and prompt-generated flowcharts."
---

This site is built entirely from Markdown files in the `posts/` folder — no CMS,
no database. Adding a new project, blog post, or page is as simple as adding a
new `.md` file with front-matter.

Diagrams are authored by describing a flow in plain English and asking Copilot
to turn it into a Mermaid block, which renders as an actual diagram on the page:

```mermaid
flowchart TD
    A[Write plain-English description] --> B[Ask Copilot to generate Mermaid]
    B --> C[Mermaid block committed to .md file]
    C --> D[Site renders it as a diagram]
```

See [PORTFOLIO_RULES.md](../PORTFOLIO_RULES.md) for the full conventions.

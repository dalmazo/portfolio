---
title: "Looney Tunes: WoM"
date: "2019-10 – 2022-04"
type: "project"
summary: "Built a LiveOps art pipeline that cut asset integration from over a day to under 30 minutes."
tags: ["C#", "Windows command scripting", "Photoshop JavaScript"]
link: "https://youtu.be/DcvUOqqnc3g?t=60"
---

## Technical Artist

### LiveOps art integration

I joined the team to handle LiveOps art integration. Alongside my day-to-day
work, I set aside time to build an automation pipeline that would make my job
easier.
It automated the process shown below, taking it from more than a day of manual
work to under 30 minutes on a cloud-hosted macOS machine.

When I left the project, the pipeline covered about 80% of asset types. Most
manual integration work for those assets was no longer needed. I documented
the pipeline so the team could build on it after I left, and they later
expanded it to all LiveOps assets. This is one of the contributions I'm most
proud of.

### Old manual LiveOps pipeline

```mermaid
flowchart TD
    A[Download each file] --> B[Open file in Photoshop]
    B --> C[Run actions to export assets]
    C --> D{Assets exported correctly?}
    D -->|No| E[Fix assets manually]
    E --> C
    D -->|Yes| F[Open Unity and import assets]
    F --> G[Create prefabs and ScriptableObjects]
    G --> H[Assign asset bundles]
    H --> I[Review the assets]
    I --> J[Commit changes and open pull request]
    I --> K[Upload previews to Google Drive]
    I --> L[Update game designers' spreadsheet]
    J --> M[Share pull request links and wait for approval]
```

### New automated LiveOps pipeline

```mermaid
flowchart TD
    A[Photoshop script and actions export PNG assets] --> B[Asset Graph integrates assets in Unity]
    B --> C[Jenkins runs Python automation]
    C --> D[Update Google Spreadsheet]
    C --> E[Upload previews to Google Drive]
    C --> G[Open GitHub pull request]
```

### Production tools

I also built small tools for Unity, Jenkins, and Git to track project commits
and maintain the GitHub page.

### UI integrations

I worked on UI integrations for the boss battle revamp, daily check-ins, and
other features.

### Shaders and materials

I developed a shader function to process LUTs across the project without
relying on Unity's post-processing stack. Because the render pipeline was
heavily customized, we integrated the function directly into each shader that
needed it. This opened up new visual possibilities for characters, effects,
and customization throughout the game.

```youtube
https://youtu.be/DcvUOqqnc3g?t=60
```
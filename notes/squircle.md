---
title: "Tutorial: Building a Squircle Material Function"
date: "2026-10-09"
type: "blog"
summary: "Build an adjustable, antialiased squircle mask in Unreal Engine's material editor."
tags: ["UI", "Material", "Unreal"]
---

## What is a squircle?

![This is a squircle:](/images/notes/Squircle.png)

It's not quite a square and not quite a circle. It's a *squircle*!

In this tutorial, we'll build one directly in Unreal Engine's material editor. The same idea can be recreated in Unity, though the node setup will be different.

Before you start, read [my introduction to signed distance fields](/notes/SDFs). This tutorial builds on those ideas.

Here's the complete material function we'll build:

![Nodes](/images/notes/Squircle_Nodes.png)

Let's walk through the graph from left to right.

### GetUserInterfaceUV

![GetUserInterfaceUV](/images/notes/GetUserInterfaceUV.png)

I still think this node should be called `GetUIUV`... but never mind.

The node provides several UV and size outputs. We'll use two:

- **Normalized UV** gives us coordinates from 0 to 1 across the UI element. We'll use these for the shape calculations.
- **Pixel Size** gives us the UI element's width and height in pixels. We'll use these to account for its aspect ratio, so the shape keeps the proportions we expect even when the element isn't square. Your UI element doesn't have to be square!

### The bottom section: aspect ratio and exponents

The bottom section compares the width-to-height ratio with the height-to-width ratio, then uses the larger ratio to prepare a power value for each axis. One uses the `Pow` input; the other scales it by the aspect ratio. The `If` nodes make sure the adjustment is applied to the correct axis, whether the element is wider or taller.

This correction matters because both UV axes run from 0 to 1, even when they represent different numbers of pixels.

### The upper section: building the shape

The upper section builds a squircle-like field from the UVs. First, it measures each coordinate's distance from the center, scales those distances, and raises them to the exponents calculated below.

The two `Power` nodes produce the fields shown here:

![Pow](/images/notes/Squircle_Pow.png)

We then take the `Min` and `Max` of those values:

![MinMax](/images/notes/Squircle_MinMax.png)

Appending those two values gives us a 2D vector. Measuring its length combines the two axis fields into one radial field:

![AppendLength](/images/notes/Squircle_AppendLength.png)

At this point, you might be asking:

> Where the hell are you going with all these calculations?! It's 2 a.m.! Use an image instead!

And I'd say: we're already there.

![End](/images/notes/Squircle_End.png)

The `0.5` multiplier scales the combined field. The graph sends this result to two places: into the `MF_UI_AA` function from [the previous tutorial](/notes/SDFs) to antialias the filled shape, and through `1-x` to produce an output with the opposite polarity.

The graph calls this output an SDF, but strictly speaking it's an **SDF-like implicit field**, not an exact signed distance field: its values don't represent the precise distance to the nearest point on the boundary. That's fine for making this mask, but keep it in mind if you need accurate distances for other effects.

## What can I do with it?

Here's the fun part! We can use the output as a mask to tint the squircle with a simple color:

![Option 1](/images/notes/Squircle_Colored1.png)

Or we can use the UI UVs to blend colors and get more interesting results:

![Option 2](/images/notes/Squircle_Colored2.png)

And that's it! You now have an adjustable squircle material function for UI.

### What about the mysterious `1.61`?

I liked how the squircle looked with this value, but the best value depends on the look you're after. Try adjusting the `Pow` input and see how the shape changes:

```video
/videos/squircle_lerpdemo.mp4
```

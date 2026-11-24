---
title: "Tutorial: Pixel-Perfect Anti-Aliasing for UI Materials"
date: "2026-10-08"
type: "blog"
cover: "/images/notes/SDF_Perfect_Circle.png"
summary: "Turn a jagged material circle into a smooth, pixel-perfect edge in Unreal, with a signed distance field and screen-space derivatives."
tags: ["UI", "Material", "Unreal", "Anti-aliasing"]
---

Draw a shape with math in a UI material and you'll quickly meet jagged edges.
In this tutorial, we'll start from a plain circle, see why the usual fixes
fall short, and build `MF_UI_AA`: a small material function that keeps any
shape's edge smooth and about one pixel wide, at any size.

To get there, we need one tool first: a **signed distance field**.

### What's an SDF, quickly?

A signed distance field (SDF) stores, for every point, the distance to the
edge of a shape. The **signed** part means the value tells you which side
you're on: negative inside the shape, zero on the edge, positive outside.

SDFs solve a lot of scaling and visual problems in both 2D and 3D. I'm only
covering 2D here; *I'm not the 3D tech art guy*. In 2D they power crisp fonts,
procedural shapes and UI effects, and they're exactly what anti-aliasing needs.

### Step 1: a distance field

Here's the simplest one I can make:

![This is a circle, trust me.](/images/notes/SDF_Distance_05.png)
> `Distance(TexCoord, 0.5)` measures how far each point is from the center of the texture, `(0.5, 0.5)`.

This is a distance field, but not a signed one yet: every value is 0 or
more. Subtracting the radius (`distance - 0.5`) makes it signed, with negative
values inside the circle and positive values outside. Keep that in mind,
because `MF_UI_AA` does exactly that later on.

### Step 2: a jagged circle

Let's turn the distance into a circle:

![I told you it's a circle!](/images/notes/SDF_Ugly_Circle.png)
![The circle mask after Step](/images/notes/SDF_Circle_PreAA.png)
> `Step` gets the distance in **Y** and the radius, `0.5`, in **X**. It returns 1 where `X >= Y`, so 1 inside the circle and 0 outside. Each pixel is either fully in or fully out, so there's no transition at the edge.

That's why it looks jagged up close:

![Close-up of the jagged edge](/images/notes/SDF_Circle_Corner_Jagged.png)

### Step 3: a smoother, but fake, edge

The usual next try is `SmoothStep`:

![Less jagged but still jagged](/images/notes/SDF_Circle_Still_Jagged.png)
> `SmoothStep` with **Min** `0.5` and **Max** `0.498` blends the edge across a band of 0.002 UV. The range is inverted on purpose, so the inside stays 1.

At normal size, it can be good enough:

![SmoothStep result at normal size](/images/notes/SDF_Circle_Fake.png)

The problem is that the band is fixed in UV space, not in pixels. Make the
widget bigger and the band covers less than a pixel, so the jaggies come
back. Make it smaller and the edge turns blurry. We need an edge that adapts
to the size the shape is actually drawn at.

### Step 4: MF_UI_AA, the pixel-perfect edge

This function is based on
[Unity's Anti-Aliasing node](https://docs.unity3d.com/Packages/com.unity.shadergraph@17.2/manual/Shader-Graph-Sample-UGUI-Shaders-Subgraph-nodes.html#anti-aliasing),
from the Shader Graph 17.2.0 UGUI Shaders sample:

![MF_UI_AA](/images/notes/MF_UI_AA.png)

Reading it from left to right:

1. **Subtract 0.5** turns the input distance into a signed distance: negative inside the circle, positive outside (Step 1).
2. **DDX** and **DDY** measure how much that value changes from one pixel to the next, horizontally and vertically. **AppendMany → Length** combines them into a single number: the change per pixel.
3. **Divide** the signed distance by that number, and you get the distance to the edge **in pixels**, whatever the size of the widget.
4. **0.5 − x** and **Saturate** turn that into a 0–1 mask, with the transition spread over about one pixel, centered on the edge.

Because the derivatives are recalculated for every pixel on screen, the edge
stays one pixel wide at any size.

### The result

![Anti-aliased circle](/images/notes/SDF_Perfect_Circle.png)
![Nodes for the anti-aliased circle](/images/notes/SDF_Perfect_Circle_Nodes.png)
> Plug the distance into `MF_UI_AA` and the circle gets a smooth, one-pixel edge at its displayed size.

![Perfection.](/images/notes/SDF_Perfection_Meme.jpg)

`MF_UI_AA` works with any shape that has a distance field, not just circles.
In [the squircle tutorial](/notes/squircle), I use it to anti-alias an
adjustable squircle.

### References

- [Signed Distance Fields — maxmain.io](https://maxmain.io/touchdesigner-components/tops/signed-distance-fields/)
- [Unity Shader Graph UGUI Shaders sample — Anti-Aliasing node](https://docs.unity3d.com/Packages/com.unity.shadergraph@17.2/manual/Shader-Graph-Sample-UGUI-Shaders-Subgraph-nodes.html#anti-aliasing)

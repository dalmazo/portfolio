---
title: "Tutorial sessions: SDFs"
date: "2026-10-08"
type: "blog"
summary: "What are SDFs, and why do I need to know they exist?"
tags: ["UI", "Material", "Unreal", "Unity"]
---

#### What is an SDF?

*Copying and pasting from Google:*

>A Signed Distance Field (SDF)—or signed distance function—is a mathematical representation that assigns a numeric value to any point in space, representing the shortest distance from that point to the closest surface of an object.


#### And why do I need to know about them for game development?

I love this question, hehehe.

Knowing about SDFs allows game developers to solve some of the hardest performance, scaling, and visual problems in both 2D and 3D graphics.

But I'm not going to talk about 3D here; *I'm not the 3D tech art guy*.

In 2D, SDFs can be used to build fonts, shaders, effects...


#### Let's dive into Unreal's material universe

Here's the simplest SDF I can make:

![This is a circle, trust me.](/images/notes/SDF_Distance_05.png)
> `Distance(TexCoord, 0.5)` measures how far each point is from the center of the texture, `(0.5, 0.5)`. 

Okay! But what is this for?

We can use it to make a circle:


![I told you it's a circle!](/images/notes/SDF_Ugly_Circle.png)
![And it looks jagged](/images/notes/SDF_Circle_PreAA.png)
>`Step(0.5, distance)` compares that distance to the circle's radius and turns it into a sharp inside-or-outside result. Since pixels at the edge have to switch abruptly from one to the other, the circle can look jagged.

But it still looks jagged:
![Jagged AF](/images/notes/SDF_Circle_Corner_Jagged.png)

Let's try to fix it with another node:
![Less jagged but still jagged](/images/notes/SDF_Circle_Still_Jagged.png)


This smooth step gives us a smoother result, but the jagged edges don't disappear entirely.
Although It can be good enough in many cases...
![Still Jagged](/images/notes/SDF_Circle_Fake.png)
>`SmoothStep` makes the switch gradual, so the edge looks smoother, but it doesn't account for the size of the pixels. 

But if we want a pixel-perfect circle, we can make an MF_UI_AA based on [Unity's Anti-Aliasing Node](https://docs.unity3d.com/Packages/com.unity.shadergraph@17.2/manual/Shader-Graph-Sample-UGUI-Shaders-Subgraph-nodes.html#anti-aliasing), found in the Shader Graph 17.2.0 UGUI Shaders example:
![MF_UI_AA](/images/notes/MF_UI_AA.png)

And here's the final result:
![Perfection.](/images/notes/SDF_Perfect_Circle.png)
![Perfection.](/images/notes/SDF_Perfect_Circle_Nodes.png)
>The anti-aliasing function does: it blends the edge over roughly one pixel, keeping it smooth at the displayed size.


![Perfection.](https://media.makeameme.org/created/perfection-d530b4eff3.jpg)




#### References
https://maxmain.io/touchdesigner-components/tops/signed-distance-fields/
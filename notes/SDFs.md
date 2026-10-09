---
title: "Tutorial sessions: SDFs"
date: "2026-10-08"
type: "blog"
summary: "What is SDFs and why I need to know about it's existance?"
tags: ["UI", "Material", "Unreal", "Unity"]
---

#### What is a SDF?

*Coping and pasting from Google:*

>A Signed Distance Field (SDF)—or signed distance function—is a mathematical representation that assigns a numeric value to any point in space, representing the shortest distance from that point to the closest surface of an object.


#### And why do I need to know about it for game development? 

I love this question heehehe

Knowing about SDFs allow game developers to solve some of the hardest performance, scaling, and visual problems in both 2D and 3D graphics.

But I'm not gonna talk about 3D here, *I'm not the 3D tech art guy*.

For 2D, SDFs can be used fo building fonts, shaders, effects...


### Let's dive into the Unreal material universe

The quickest SDF I can make is this simple thingy:
![This is a circle, trust me.](/images/notes/SDF_Distance_05.png)

Ok! But what is this for? 

We can make a circle out of it:
![I told you it's a circle:](/images/notes/SDF_Ugly_Circle.png)
![and it looks jagged](/images/notes/SDF_Circle_PreAA.png)

But it really looks jagged
![Jagged AF](/images/notes/SDF_Circle_Corner_Jagged.png)

Let's try to fix it with another node:
![Less jagged but still jagged](/images/notes/SDF_Circle_Still_Jagged.png)

This smooth step fakes a improvement, making the jagged vanishes, but not entirely. 
It can be enough for lot's of moments... 
![Still Jagged](/images/notes/SDF_Circle_Fake.png)

But if we want a pixel perfect circle, we can make a MF_UI_AA based on the [Unity's AntiAliasing Node](https://docs.unity3d.com/Packages/com.unity.shadergraph@17.2/manual/Shader-Graph-Sample-UGUI-Shaders-Subgraph-nodes.html#anti-aliasing) present in the Shader Graph 17.2.0 UGUI Shaders Example:
![MF_UI_AA](/images/notes/MF_UI_AA.png)

And now, this is the final result:
![Perfection.](/images/notes/SDF_Perfect_Circle.png)
![Perfection.](/images/notes/SDF_Perfect_Circle_Nodes.png)

![Perfection.](https://media.makeameme.org/created/perfection-d530b4eff3.jpg)



#### Refs
https://maxmain.io/touchdesigner-components/tops/signed-distance-fields/
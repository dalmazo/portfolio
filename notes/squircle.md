---
title: "Tutorial sessions: Squircle"
date: "2026-10-09"
type: "blog"
summary: "How to make a squircle material you can use in your things"
tags: ["UI", "Material", "Unreal"]
---

#### What is a Squircle

![This is a squircle:](/images/notes/Squircle.png)
Not a square, nor a circle... it's a *SQUIRCLE* !

This is a tuto to make a squircle, going directly into the engine - unreal for now, but totally possible in unity too!
I'm gonna ask you to first read the first post about SDFs, this will be a part 2 kinda of.

This is the whole setup for a material function that calculates the squircle:

![Nodes](/images/notes/Squircle_Nodes.png)


Let's try to explain the idea behind the nodes: 


##### GetUserInterfaceUV
![GetUserInterfaceUV](/images/notes/GetUserInterfaceUV.png)
Which in my opnion should be renamed to GetUIUV, ahn... nevermind...

This node gives us 5 different types of output, distorting the UV in some glorious way

In this tuto, we will use two different outputs of this node:

NormalizedUV: Standard 0-to-1 texture coordinates bounded to the UI element's dimensions.
All the shape and main sdf calculations will be based on the whole normalized UV.

Pixel Size: The size of the UI element or container measured in pixels. 
This is used to calculate the aspect ratio of the squircle, don't listen to your math teacher, some squares can be rect.

##### The bottom part
The idea here is to calc the aspect ratio of the image and exports two named reroutes, one for each X and Y further calculations, but the values are very simple, one result will be the inputed (Pow) variable and the other will be (Pow) * (Aspect Ratio). As simple as it should be.

##### The upper part
The idea here is to make a squircle SDF, basically we start making the same circle that we already knows how to make, and we will distort it based on the Pow result of the bottom part. 
The results of this initial math will give us a very simple shape to play with:
![Pow](/images/notes/Squircle_Pow.png)

With this in mind, we can get the Min/Max of those values, getting two mesmerizing sdf shapes.  
![MinMax](/images/notes/Squircle_MinMax.png)

And if we append those two 1D vectors, we will get a 2D vector as mesmerizing as the min mix one.
With this in mind, we want to get the length of this vector. 

Length: Calculates the magnitude of a vector from the origin.
![AppendLength](/images/notes/Squircle_AppendLength.png)

Now you can say:
Where the fuck are you going with all those calculations?! It's 2 AM! Use a image instead!!!!
And I'll say: 
We already arrived.
![End](/images/notes/Squircle_End.png) 

Multipling it by two we can get the necessary shape to use it. 
(It's always good pratice to use the AA node that we already has discussed about)

And if we just invert the values we will have the proper sdf of the shape

## Ok Good! But now what? What should I do with this shape or even the SDF?!

Here comes the fun! 

We can use it the output to just tint it with some very simple coloring:
![Option 1](/images/notes/Squircle_Colored1.png) 

Or even playing a bit more with the UI UV and merging the colors a bit to get better results:
![Option 2](/images/notes/Squircle_Colored2.png) 

And that's it folks! 
Now you have a pretty decent squircle node material function!

And what about that mysterious 1.61?! 
I loved how the squircle looked with this magic number, but this is how it looks if you play with it a bit:

```video
/videos/squircle_lerpdemo.mp4
```

 


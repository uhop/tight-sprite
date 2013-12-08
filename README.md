# tight-sprite [![Build Status](https://secure.travis-ci.org/uhop/tight-sprite.png?branch=master)](http://travis-ci.org/uhop/tight-sprite) [![Dependency Status](https://david-dm.org/uhop/tight-sprite.png)](https://david-dm.org/uhop/tight-sprite)

> Tight 2D rectangle packer suitable for sprites.

This package implements a  2D rectangle packing. It is conceived to serve as a foundation for producing CSS sprites.
If you are interested in efficient image asset management for your web projects, please visit our sister project:
[grunt-tight-sprite](https://github/uhop/grunt-tight-sprite).

## Introduction

[CSS sprites][] is a techniques designed to replace multiple images with one, which combines all of them.
The goal is to increase the overall performance of a web application by:

* Minimizing number of downloads, which is important in a high-latency scenarios.
* Minimizing amount of data transferred, which is important for low-speed connections.
* Optimizing memory management on a client (one vs. many objects to keep), which is important on low-powered clients.

All three points have the biggest impact on mobile platform, but are generic enough to improve all web application targets.

While modern compression tools can produce small files even from naively made sprites, e.g.,
all images are vertically stacked padded with a static color. This padding is essentially a wasted
space, but usually it can be efficiently compressed. At some point such sprite will reach
its destination and will be unpacked spending 3-4 bytes per pixel regardless of how it was
compressed before. Browsers retain images as long as they are visible, so typically sprites are
live during the life span of their web application reducing the available memory, forcing more
frequent runs of a garbage collector, and even forcing some applications into swapping.

Assuming that all images in a sprite are necessary, the only part, which can be reduced, is a wasted
area. The way to reduce waste is to use an efficient packing algorithm. This is the purpose of this library.

##  Motivation

[Packing problems](http://en.wikipedia.org/wiki/Packing_problem) are an old well-studied area of math.
It is fueled by real world problems: optimization of finite resources, storage, transportation, and, yes, packing.
Typical problems are: how to minimize a number of pallets to hold a given set of objects, or how to cut
a sheet of paper into smaller pieces reducing waste and maximizing profit.

Sometimes real world collides with a virtual world of CSS sprites. For example, technologically certain
materials can be  cut only with guillotine scissors: straight line from edge to edge. Obviously this restriction
is not applicable for images. Or in majority of cases producers deal with predefined pallet sizes. We can make
images of any size for CSS sprites.

It is proven that the problem is NP-complete. In practice it means that the only way to solve it exactly is by
trying all possible permutations, which is possible only for a small number of rectangles, or in special
circumstances (e.g., all of them are of equal size). For example, *Huang and Korf* (see References below)
report on finding an exact solution for packing of 32 squares from 1x1 to 32x32 using their state of the art
solver in 33 days 11 hours, 36 minutes, and 23 seconds. The previous record was 27 squares.

Given all that practical solutions usually use some kind of heuristics, which is not perfect, and can produce
hilariously sub-par solutions, but relatively fast, and usually close enough to an optimal solution. Obviously
many heuristics were proposed since invention of computers.

While there are plenty of tools available to produce sprites, hardly any of them are concerned with efficient
packing. There are many variants of naive stacking, or its variation: shelf packing (essentially horizontal
stack of vertical stacks). Both are clearly suboptimal. Very popular are various tree-based algorithms based
on guillotine splits. Because we don't require guillotine cuts, this built-in restriction prohibits certain
optimizations. And of course there are some home-grown algorithms, which do not perform better than
existing techniques proposed by mathematicians specializing in this area.

This package implements two well-known algorithms:

* Maximal rectangles algorithm as described by *Jylänki* (see References below).
  It is the main algorithm of the package.
* Envelope algorithm as described by *Martello, Pisinger, Vigo* (see References below).
  It is similar to what *Jylänki* calls "Skyline" algorithm. While this algorithm can be used on its own,
  it is primary there to provide estimates for the maximal rectangles algorithm.

Both algorithms determine an optimal bounding rectangle size automatically.

## Installation

```
npm install tight-sprite
```

## Documentation

### palletizing(rectangles, options)

This function implements the maximal rectangles algorithm. It takes an array of rectangles
(objects with `w` and `h` positive integer properties), and an optional options object. It
returns a result object, which includes the achieved area size, an array of rectangles
(similar to the input but can be rearranged), and an array of rectangle positions.

Example:

```js
var palletizing = require("tight-sprite/palletizing");

// let's solve 1-to-32 square problem
var rectangles = [];
for(var i = 1; i <= 32; ++i){
  rectangles.push({w: i, h: i});
}

var result = palletizing(rectangles);
console.log("found area: ", result.area);
result.layout.forEach(function(pos){
  var rect = result.rectangles[pos.n];
  console.log(pos.x, pos.y, rect.w, rect.h);
});
```

Arguments of `palletizing()` are:

* **rectangles** -- an array of objects. You can keep anything you want in those objects,
  but the algorithm assumes that it has positive integer properties `w` and `h` for "width"
  and "height" correspondingly. The algorithm may add additional properties: `i`, `group`,
  `area`. Everything else should be safe.
* **options** -- an optional object. If present it may specify following properties:
  * **silent** -- a boolean value. If truthy, it suppresses all console-bound output. Default: `false`.

The returned object has following properties:

* **area** -- a positive integer, which indicates what area was achieved. The whole point of
  the algorithm is to pack all rectangles minimizing this value.
* **rectangles** -- an array of objects similar to the corresponding input argument. It points
  to the same objects, but they order can be different.
* **layout** -- an array of position objects with following properties:
  * **n** -- an integer. It is an index of a rectangle in **rectangles**, which corresponds to
    this position.
  * **x** -- a positive integer, which is a horizontal coordinate of a rectangle's left.
  * **y** -- a positive integer, which is a vertical coordinate of a rectangle's top.

## Demo

The 32 squares problem, which was described above, is included as a test,
but in a slightly different form. This is how it looks when it runs:

```
$ time node tests/test_squares.js
Packing 32 rectangles using the maximal rectangles algorithm.
Found rectangle 469 by 32 wasting 1616 pixels.
Found rectangle 407 by 33 wasting 1496 pixels.
Found rectangle 317 by 43 wasting 1331 pixels.
Found rectangle 296 by 45 wasting 935 pixels.
Found rectangle 274 by 47 wasting 404 pixels.
Found rectangle 236 by 51 wasting 392 pixels.
Found rectangle 231 by 51 wasting 341 pixels.
The best solution with the maximal rectangles algorithm wasted 341 pixels.
BEST:  width: 231, height: 51, waste: 341 (2.89%)
IDEAL: width: 135, height: 85, waste: 35 (0.31%)

real  0m0.309s
user  0m0.295s
sys 0m0.016s
```

You can see the trade-off: it runs in a sub-second time instead of 33+ days, but it wastes slightly more pixels.

## References

Eric Huang and Richard E. Korf. New improvements in optimal rectangle packing.
IJCAI'09 Proceedings of the 21st international jont conference on Artifical intelligence. Pages 511-516.

Silvano Martello, David Pisinger, Daniele Vigo. The Three-Dimensional Bin Packing Problem.
Operations Research, Volume 48 Issue 2, March 2000. Pages 256-267.

Jukka Jylänki. A Thousand Ways to Pack the Bin - A Practical Approach to Two-Dimensional Rectangle Bin Packing.
Online resource at http://clb.demon.fi/files/RectangleBinPack.pdf.

[CSS sprites] http://en.wikipedia.org/wiki/Sprite_(computer_graphics)#Sprites_by_CSS
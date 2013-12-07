"use strict";


var windowOpt   = require("./lib/solvers/windowOpt");

var getSize  = require("./lib/utils/getSize");
var getArea  = require("./lib/utils/getArea");
var rotate   = require("./lib/utils/rotate");
var unrotate = require("./lib/utils/unrotate");
var getTotalArea = require("./lib/utils/getTotalArea");
var rotateLayout = require("./lib/utils/rotateLayout");
var isSymmetric  = require("./lib/utils/isSymmetric");


module.exports = function(rectangles, strategies, options){
	options = options || {};

	if(!options.silent){
		console.log("Packing " + rectangles.length + " rectangles with " +
			strategies.length + " strategies using the envelope-based algorithm.");
	}

	var depth = options.depth || 3,
		finalDepth = options.finalDepth || depth;

	var totalArea = getTotalArea(rectangles),
		bestArea = Infinity, bestLayout = null, bestRectangles = null;

	packing: {
		strategies.some(function(produceScore, index){
			if(!options.silent){
				console.log("Trying strategy #" + (index + 1) + " ...");
			}
			var result = windowOpt(rectangles, produceScore, depth, finalDepth),
				area = getArea(rectangles, result.layout);
			if(!options.silent){
				console.log("Wasted " + (area - totalArea) + " pixels.");
			}
			if(result.layout && area < bestArea){
				bestArea = area;
				bestLayout = result.layout;
				bestRectangles = rectangles.slice(0);
			}
			return bestArea === totalArea;
		});

		if(bestArea === totalArea || options.suppressSymmetry || isSymmetric(rectangles)){
			break packing;
		}

		if(!options.silent){
			console.log("Trying a rotated solution.");
		}

		var rotatedRectangles = rotate(rectangles);

		strategies.some(function(produceScore){
			if(!options.silent){
				console.log("Trying strategy #" + (index + 1) + " ...");
			}
			var result = windowOpt(rotatedRectangles, produceScore, depth, finalDepth),
				area = getArea(rectangles, result.layout);
			if(!options.silent){
				console.log("Wasted " + (area - totalArea) + " pixels.");
			}
			if(result.layout && area < bestArea){
				bestArea = area;
				bestLayout = rotateLayout(result.layout);
				bestRectangles = unrotate(rectangles);
			}
			return bestArea === totalArea;
		});
	}

	if(!options.silent){
		console.log("The best solution with the envelope-based algorithm wasted " +
			(bestArea - totalArea) + " pixels.");
	}

	return {area: bestArea, layout: bestLayout, rectangles: bestRectangles};
};

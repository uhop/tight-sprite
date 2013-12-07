"use strict";


var windowOpt   = require("./lib/windowOpt");

var getSize  = require("./lib/utils/getSize");
var getArea  = require("./lib/utils/getArea");
var rotate   = require("./lib/utils/rotate");
var unrotate = require("./lib/utils/unrotate");
var getTotalArea = require("./lib/utils/getTotalArea");
var rotateLayout = require("./lib/utils/rotateLayout");
var isSymmetric  = require("./lib/utils/isSymmetric");


module.exports = function(rectangles, strategies, options){
	options = options || {};
	var depth = options.depth || 3,
		finalDepth = options.finalDepth || depth,
		suppressSymmetry = options.suppressSymmetry;

	var totalArea = getTotalArea(rectangles),
		bestArea = Infinity, bestLayout = null, bestRectangles = null;

	strategies.some(function(produceScore){
		var result = windowOpt(rectangles, produceScore, depth, finalDepth),
			area = getArea(rectangles, result.layout);
		if(area < bestArea && result.layout){
			bestArea = area;
			bestLayout = result.layout;
			bestRectangles = rectangles.slice(0);
		}
		return bestArea === totalArea;
	});

	if(bestArea === totalArea || suppressSymmetry || isSymmetric(rectangles)){
		return {area: bestArea, layout: bestLayout, rectangles: bestRectangles};
	}

	var rotatedRectangles = rotate(rectangles);

	strategies.some(function(produceScore){
		var result = windowOpt(rotatedRectangles, produceScore, depth, finalDepth),
			area = getArea(rectangles, result.layout);
		if(area < bestArea && result.layout){
			bestArea = area;
			bestLayout = rotateLayout(result.layout);
			bestRectangles = unrotate(rectangles);
		}
		return bestArea === totalArea;
	});

	return {area: bestArea, layout: bestLayout, rectangles: bestRectangles};
};

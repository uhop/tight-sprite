"use strict";


var maxRect = require("./lib/solvers/maxRect");
var Pallet  = require("./lib/Pallet");
var getArea = require("./lib/utils/getArea");
var getTotalArea = require("./lib/utils/getTotalArea");


module.exports = function(rectangles, options){
	options = options || {};

	if(!options.silent){
		console.log("Packing " + rectangles.length +
			" rectangles using the maximal rectangles algorithm.");
	}

	var pallet = new Pallet(rectangles),
		totalArea = options.silent ? 0 : getTotalArea(rectangles),
		bestArea = Infinity, bestLayout = null;

	for(;;){
		var layout = maxRect(rectangles, pallet.w, pallet.h);
		if(layout){
			var area = getArea(rectangles, layout);
			if(area < bestArea){
				bestArea = area;
				bestLayout = layout;
				if(!options.silent){
					console.log("Found rectangle " + pallet.w +
						" by " + pallet.h + " wasting only " +
						(area - totalArea) + " pixels.");
				}
			}
			if(!pallet.next(area)){
				break;
			}
		}else{
			if(!pallet.next()){
				break;
			}
		}
	}

	if(!options.silent){
		console.log("The best solution with the maximal rectangles algorithm wasted " +
			(bestArea - totalArea) + " pixels.");
	}

	return {area: bestArea, layout: bestLayout, rectangles: rectangles};
};

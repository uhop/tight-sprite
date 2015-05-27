"use strict";


var maxRect = require("./lib/solvers/maxRect");
var Pallet  = require("./lib/Pallet");
var getSize = require("./lib/utils/getSize");
var getTotalArea = require("./lib/utils/getTotalArea");


module.exports = function(rectangles, options){
	options = options || {};

	if(!options.silent){
		console.log("Packing " + rectangles.length +
			" rectangles using the maximal rectangles algorithm.");
	}

	var pallet = new Pallet(rectangles),
		totalArea = options.silent ? 0 : getTotalArea(rectangles),
		bestArea = Infinity, bestLayout = null, width = 0, height = 0;

	for(;;){
		var layout = maxRect(rectangles, pallet.w, pallet.h);
		if(layout){
			var size = getSize(rectangles, layout);
			if(size.area < bestArea){
				bestArea = size.area;
				bestLayout = layout;
				width = size.w;
				height = size.h;
				if(!options.silent){
					console.log("Found rectangle " + size.w +
						" by " + size.h + " wasting " +
						(size.area - totalArea) + " pixels.");
				}
			}
			if(!pallet.next(size.area)){
				break;
			}
		}else{
			if(!pallet.next()){
				break;
			}
		}
	}

	if(!options.silent){
		var waste = bestArea - totalArea;
		if(waste){
			console.log("The best solution wasted " + waste + " pixels.");
		}else{
			console.log("Found ideal solution.");
		}
	}

	return {area: bestArea, w: width, h: height, layout: bestLayout, rectangles: rectangles};
};

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
		bestArea = Infinity, bestLayout = null, width = 0, height = 0;

	for(;;){
		var layout = maxRect(rectangles, pallet.w, pallet.h);
		if(layout){
			var area = getArea(rectangles, layout);
			if(area < bestArea){
				bestArea = area;
				bestLayout = layout;
				width = pallet.w;
				height = pallet.h;
				if(!options.silent){
					console.log("Found rectangle " + pallet.w +
						" by " + pallet.h + " wasting " +
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
		var waste = bestArea - totalArea;
		if(waste){
			console.log("The best solution wasted " + waste + " pixels.");
		}else{
			console.log("Found ideal solution.");
		}
	}

	return {area: bestArea, w: width, h: height, layout: bestLayout, rectangles: rectangles};
};

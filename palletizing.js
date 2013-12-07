"use strict";


var maxRect = require("./lib/solvers/maxRect");
var Pallet  = require("./lib/Pallet");
var getArea = require("./lib/utils/getArea");


module.exports = function(rectangles){
	var pallet = new Pallet(rectangles),
		bestArea = Infinity, bestLayout = null;

	for(;;){
		var layout = maxRect(rectangles, pallet.w, pallet.h);
		if(layout){
			var area = getArea(rectangles, layout);
			if(area < bestArea){
				bestArea = area;
				bestLayout = layout;
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

	return {area: bestArea, layout: bestLayout, rectangles: rectangles};
};

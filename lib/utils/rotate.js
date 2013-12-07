"use strict";


function swapSizes(rect){
	var w = rect.w, h = rect.h, newRect = Object.create(rect);
	newRect.w = h;
	newRect.h = w;
	newRect.original = rect;
	return newRect;
}


module.exports = function(rectangles){
	return rectangles.map(swapSizes);
};

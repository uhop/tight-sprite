"use strict";


function swapSizes(rect){
	return rect.original || rect;
}


module.exports = function(rectangles){
	return rectangles.map(swapSizes);
};

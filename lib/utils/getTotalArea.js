"use strict";


function accumulateArea(acc, rect){
	return acc + rect.w * rect.h;
}


module.exports = function(rectangles){
	return rectangles.reduce(accumulateArea, 0);
};

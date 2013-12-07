"use strict";


function addArea(rect){
	rect.area = rect.w * rect.h;
}


module.exports = function(rectangles){
	rectangles.forEach(addArea);
	return rectangles;
};

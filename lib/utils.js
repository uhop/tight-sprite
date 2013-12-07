"use strict";


module.exports = {
	addArea: function(rectangles){
		rectangles.forEach(function(rect){
			rect.area = rect.w * rect.h;
		});
		return rectangles;
	}
};
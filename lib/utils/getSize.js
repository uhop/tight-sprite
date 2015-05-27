"use strict";


module.exports = function(rectangles, layout){
	var w = 0, h = 0;
	layout.forEach(function(pos){
		var rect = rectangles[pos.n];
		w = Math.max(w, pos.x + rect.w);
		h = Math.max(h, pos.y + rect.h);
	});
	return {w: w, h: h, area: w * h};
};

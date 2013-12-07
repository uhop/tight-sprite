"use strict";


function cmp(a, b){
	return a.w < b.w || a.w === b.w && a.h < b.h;
}


module.exports = function(rectangles){
	var a = rectangles.map(function(rect){
			return {w: rect.w, h: rect.h};
		}).sort(cmp),
		b = rectangles.map(function(rect){
			return {w: rect.h, h: rect.w};
		}).sort(cmp);
	for(var i = 0, n = a.length; i < n; ++i){
		if(a[i].w !== b[i].w || a[i].h !== b[i].h){
			return false;
		}
	}
	return true;
};

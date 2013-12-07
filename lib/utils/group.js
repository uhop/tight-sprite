"use strict";


module.exports = function(rectangles){
	// rectangles are already sorted in such a way,
	// so identically shaped rectangles are grouped
	var prev = null, groups = [], group = [];
	rectangles.forEach(function(rect, i){
		rect.n = i;
		if(i){
			rect.group = prev.group;
			if(rect.w != prev.w || rect.h != prev.h){
				++rect.group;
				groups.push(group);
				group = [];
			}
		}else{
			rect.group = 0;
		}
		group.push(i);
		prev = rect;
	});
	if(rectangles.length){
		groups.push(group);
	}
	return groups;
};

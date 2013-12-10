"use strict";


var FreeRectangles = require("../FreeRectangles");
var RectState = require("../RectState");


module.exports = function(rectangles, width, height){
	var free = new FreeRectangles(width, height),
		state = new RectState(rectangles),
		groups = state.groups,
		groupList = state.groupList,
		layout = [];

	// iterate until empty
	while(groupList.next !== groupList){
		var bestDelta = Infinity, bestRect = null, bestNode = null, rect;
		for(var node = groupList.next; node !== groupList; node = node.next){
			rect = rectangles[groups[node.index][0]];
			var result = free.findBestShortSideFit(rect);
			if(result && result.delta < bestDelta){
				bestDelta = result.delta;
				bestRect  = result.rect;
				bestNode  = node;
			}
		}
		if(!bestNode){
			return null;
		}
		var group = groups[bestNode.index],
			rectIndex = group.pop(),
			rect = rectangles[rectIndex];
		if(!group.length){
			bestNode.remove();
		}
		rect.x = bestRect.x;
		rect.y = bestRect.y;
		free.exclude(rect).clean();
		layout.push({x: bestRect.x, y: bestRect.y, n: rectIndex});
	}

	return layout;
};

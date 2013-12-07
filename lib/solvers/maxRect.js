"use strict";


var FreeRectangles = require("../FreeRectangles");
var DLink = require("../DLink");


module.exports = function(rectangles, width, height){
	var free = new FreeRectangles(width, height),
		available = new DLink(), layout = [];

	rectangles.forEach(function(rect, index){
		var node = new DLink();
		node.n = index;
		node.r = rect;
		available.addBefore(node);
	});

	// iterate until empty
	while(available.next !== available){
		var bestDelta = Infinity, bestRect = null, bestNode = null;
		for(var node = available.next; node !== available; node = node.next){
			var result = free.findBestShortSideFit(node.r);
			if(result && result.delta < bestDelta){
				bestDelta = result.delta;
				bestRect  = result.rect;
				bestNode  = node;
			}
		}
		if(!bestNode){
			return null;
		}
		bestNode.remove();
		bestNode.x = bestNode.r.x = bestRect.x;
		bestNode.y = bestNode.r.y = bestRect.y;
		free.exclude(bestNode.r).clean();
		layout.push({x: bestNode.x, y: bestNode.y, n: bestNode.n});
	}

	return layout;
};

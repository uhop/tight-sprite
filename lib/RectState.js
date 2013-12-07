"use strict";


var group = require("./utils/group");
var DLink = require("./DLink");


function RectState(rectangles){
	// rectangles are assumed to be sorted and groupped
	this.rectangles = rectangles;
	this.groups = group(rectangles);
	this.groupList = new DLink();
	this.groupNodes = this.groups.map(function(_, index){
		var node = new DLink();
		node.index = index;
		this.groupList.addBefore(node);
		return node;
	}, this);
	this.totalArea = this.rectangles.reduce(function(acc, rect){
		return acc + rect.area;
	}, 0);
}

RectState.prototype = {
	getRectangle: function(node){
		node = node || this.groupList.next;
		if(node === this.groupList){
			return null;
		}
		var next = node.next,
			group = this.groups[node.index],
			index = group.pop();
		if(!group.length){
			node.remove();
		}
		return {index: index, next: next};
	},
	free: function(index, next){
		if(index >= 0 && next){
			var groupIndex = this.rectangles[index].group;
			if(this.groups[groupIndex].push(index) == 1){
				next.addBefore(this.groupNodes[groupIndex]);
			}
		}
		return this;
	}
};


module.exports = RectState;

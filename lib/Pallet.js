"use strict";


var windowOpt   = require("./windowOpt");
var RectState   = require("./RectState");
var isSymmetric = require("./utils/isSymmetric");


function gcd(a, b){
	while(b){
		var t = a % b;
		a = b;
		b = t;
	}
	return a;
}


function Pallet(rectangles){
	var maxWidth = -1, maxHeight = -1, totalArea = 0;
	rectangles.forEach(function(rect){
		maxWidth  = Math.max(maxWidth,  rect.w);
		maxHeight = Math.max(maxHeight, rect.h);
	});

	var r = rectangles.slice(0).sort(function(a, b){ return b.h < a.h; }),
		heightLimit = r[0].h + r[1].h;

	this.rectangles  = r;
	this.minWidth    = maxWidth;
	this.minHeight   = maxHeight;
	this.heightLimit = heightLimit;
	this.bestArea    = Infinity;

	function produceScore(top, stack, state){
		var cp = top.envelope.cornerPoints, w = cp[cp.length - 1].x, h = cp[0].y,
			diff = cp.length - stack[stack.length - 2].envelope.cornerPoints.length;
		return [h <= maxHeight ? top.envelope.areaIn() - top.area : Infinity, diff, w];
	}

	var result = windowOpt(rectangles, produceScore, 1, 1);

	var width = result.layout.reduce(function(acc, pos){
					var rect = rectangles[pos.n],
						right = pos.x + rect.w;
					return Math.max(acc, right);
				}, 0);

	this.h = maxHeight;
	this.w = width;

	var state = new RectState(rectangles),
		deltaW = rectangles[state.groups[0][0]].w,
		deltaH = rectangles[state.groups[0][0]].h;
	for(var i = 1, n = state.groups.length; i < n; ++i){
		if(deltaW === 1 && deltaH === 1){
			break;
		}
		if(deltaW !== 1){
			deltaW = gcd(rectangles[state.groups[i][0]].w, deltaW);
		}
		if(deltaH !== 1){
			deltaH = gcd(rectangles[state.groups[i][0]].h, deltaH);
		}
	}

	this.totalArea = state.totalArea;
	this.deltaW = deltaW;
	this.deltaH = deltaH;

	this.symmetric = isSymmetric(rectangles);
}

Pallet.prototype = {
	getMinWidth: function(){
		var widthLimit = 0;
		if(this.h <= this.heightLimit){
			for(var i = 1, r = this.rectangles, n = r.length; i < n; ++i){
				if(r[i].h + r[i - 1].h <= heightLimit){
					widthLimit += Math.min(r[i].w, r[i - 1].w);
					break;
				}
				widthLimit += r[i - 1].w;
			}
		}
		return Math.max(this.minWidth, widthLimit);
	},
	next: function(area){
		if(isNaN(area)){
			this.h += this.deltaH;
		}else{
			if(area < this.bestArea){
				this.bestArea = area;
			}
			this.w -= this.deltaW;
		}
		while(this.w * this.h < this.totalArea || this.w < this.getMinWidth()){
			if(this.w < this.minWidth || this.symmetric && this.h > this.w){
				return null;
			}
			this.h += this.deltaH;
			while(this.bestArea <= this.w * this.h){
				this.w -= this.deltaW;
			}
		}
		return {w: this.w, h: this.h};
	}
};


module.exports = Pallet;

"use strict";


var search = require("./search"),
	sort   = require("./sort");


var searchByWidth  = search.byWidth,
	searchByHeight = search.byHeight,
	sortByWidth    = sort.byWidth,
	sortByHeight   = sort.byHeight;


function excludeRectangle(target, source){
	var sl = source.x, tl = target.x, tr = tl + target.w;
	if(tr <= sl){
		return null;
	}
	var sr = sl + source.w;
	if(sr <= tl){
		return null;
	}
	var sb = source.y, tb = target.y, tt = tb + target.h;
	if(tt <= sb){
		return null;
	}
	var st = sb + source.h;
	if(st <= tb){
		return null;
	}
	var bits = [];
	if(tl < sl){
		bits.push({x: tl, y: tb, w: sl - tl, h: target.h});
	}
	if(sr < tr){
		bits.push({x: sr, y: tb, w: tr - sr, h: target.h});
	}
	if(tb < sb){
		bits.push({x: tl, y: tb, w: target.w, h: sb - tb});
	}
	if(st < tt){
		bits.push({x: tl, y: st, w: target.w, h: tt - st});
	}
	return bits;
}

function containRectangle(target, source){
	return target.x <= source.x && source.x + source.w <= target.x + target.w &&
		target.y <= source.y && source.y + source.h <= target.y + target.h;
}

function filterOutDeleted(rect){
	return !rect.deleted;
}


function FreeRectangles(w, h){
	var rect = {x: 0, y: 0, w: w, h: h};
	this.widthIndex  = [rect];
	this.heightIndex = [rect];
}

FreeRectangles.prototype = {
	findBestShortSideFit: function(rect){
		// find the smallest rectangle to accomodate our width
		var wi = this.widthIndex, pw = searchByWidth(wi, rect), nw = wi.length - pw;
		if(nw < 1){
			return null;
		}

		// find the smallest rectangle to accomodate our height
		var hi = this.heightIndex, ph = searchByHeight(hi, rect), nh = hi.length - ph;
		if(nh < 1){
			return null;
		}

		// skip to the first rectangle big enough for us iterating by width
		var dw, rw;
		for(var i = 0; i < nw; ++i){
			rw = wi[pw + i];
			if(rect.h <= rw.h){
				dw = rw.w - rect.w;
				break;
			}
		}
		if(isNaN(dw)){
			return null;
		}

		// skip to the first rectangle big enough for us iterating by height
		var dh, rh;
		for(i = 0; i < nh; ++i){
			rh = hi[ph + i];
			if(rect.w <= rh.w){
				dh = rh.h - rect.h;
				break;
			}
		}
		if(isNaN(dh)){
			return null;
		}

		return dw < dh ? {rect: rw, delta: dw} : {rect: rh, delta: dh};
	},
	exclude: function(rect){
		var newWidthIndex = [];
		for(var i = 0, wi = this.widthIndex, n = wi.length; i < n; ++i){
			var bits = excludeRectangle(wi[i], rect);
			if(bits){
				if(bits.length){
					newWidthIndex.push.apply(newWidthIndex, bits);
				}
			}else{
				newWidthIndex.push(wi[i]);
			}
		}
		this.heightIndex = sortByHeight(newWidthIndex.slice(0));
		this.widthIndex  = sortByWidth(newWidthIndex);
		return this;
	},
	clean: function(){
		for(var i = 0, wi = this.widthIndex, n = wi.length, m = n - 1; i < m; ++i){
			var rect = wi[i];
			for(var j = i + 1; j < n; ++j){
				if(containRectangle(wi[j], rect)){
					rect.deleted = true;
					break;
				}
			}
		}
		this.widthIndex  = wi.filter(filterOutDeleted);
		this.heightIndex = this.heightIndex.filter(filterOutDeleted);
		return this;
	}
};

FreeRectangles.excludeRectangle = excludeRectangle;
FreeRectangles.containRectangle = containRectangle;


module.exports = FreeRectangles;

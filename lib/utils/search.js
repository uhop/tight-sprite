"use strict";


var bsearch = require("heya-ctr/algos/binarySearch");


module.exports = {
	byWidth:  bsearch("a.w < b.w").compile(),
	byHeight: bsearch("a.h < b.h").compile(),
	byX:      bsearch("a.x < b.x").compile(),
	byYDescending: bsearch("a.y > b.y").compile()
};

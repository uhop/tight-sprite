"use strict";


var qsort = require("heya-ctr/algos/quickSort");


module.exports = {
	byWidth:  qsort("a.w < b.w").compile(),
	byHeight: qsort("a.h < b.h").compile(),
	byPerimeterDescending: qsort("b.w + b.h < a.w + a.h").compile(),
	byAreaDescending:      qsort("b.area < a.area").compile()
};

"use strict";


var getSize = require("./getSize");


module.exports = function(rectangles, layout){
	var size = getSize(rectangles, layout);
	return size.w * size.h;
};

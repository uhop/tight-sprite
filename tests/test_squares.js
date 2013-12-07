var solver = require("../palletizing");
var getSize = require("../lib/utils/getSize");
var getTotalArea = require("../lib/utils/getTotalArea");

var rectangles = [];

// create a sample
for(var i = 1; i <= 32; ++i){
	rectangles.push({w: i, h: i});
}
// ideal solution size
var idealHeight = 85, idealWidth  = 135;

var result = solver(rectangles);

var size = getSize(result.rectangles, result.layout),
	area = getTotalArea(result.rectangles);

console.log("BEST:  width: " + size.w + ", height: " + size.h + ", waste: " +
	(size.w * size.h - area) + " (" +
		((size.w * size.h - area) / size.w / size.h * 100).toFixed(2) + "%)");

console.log("IDEAL: width: " + idealWidth + ", height: " + idealHeight + ", waste: " +
	(idealWidth * idealHeight - area) + " (" +
		((idealWidth * idealHeight - area) / idealWidth / idealHeight * 100).toFixed(2) + "%)");

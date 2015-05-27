var solver = require("../palletizing");
var getSize = require("../lib/utils/getSize");
var getTotalArea = require("../lib/utils/getTotalArea");

function addRectangles(rectangles, spec){
	var t = spec.split("x"),
		w = parseInt(t[0], 10),
		h = parseInt(t[1], 10),
		n = t[2] ? parseInt(t[2], 10) : 1;
	for(var i = 0; i < n; ++i){
		rectangles.push({w: w, h: h});
	}
	return rectangles;
}

// Examples are taken from http://codeincomplete.com/posts/2011/5/7/bin_packing/example/
// Percentage filled is taken from the best possible sorting options with an automatic sizing.

var tests = [
		{name: "simple", filled: 100,
			samples: ["500x200", "250x200", "50x50x20"]},
		{name: "square", filled: 100,
			samples: ["50x50x100"]},
		{name: "tall", filled: 98,
			samples: ["50x400x2", "50x300x5", "50x200x10", "50x100x20", "50x50x40"]},
		{name: "wide", filled: 98,
			samples: ["400x50x2", "300x50x5", "200x50x10", "100x50x20", "50x50x40"]},
		{name: "tall and wide", filled: 86,
			samples: ["400x100", "100x400", "400x100", "100x400", "400x100", "100x400"]},
		{name: "powers of 2", filled: 100,
			samples: ["2x2x256", "4x4x128", "8x8x64", "16x16x32",
				"32x32x16", "64x64x8", "128x128x4", "256x256x2"]},
		{name: "odd and even", filled: 93,
			samples: ["50x50x20", "47x31x20", "23x17x20", "109x42x20",
				"42x109x20", "17x33x20"]},
		{name: "complex", filled: 100, // not really a hundred
			samples: ["100x100x3", "60x60x3", "50x20x20", "20x50x20",
				"250x250", "250x100", "100x250", "400x80", "80x400",
				"10x10x100", "5x5x500"]}
	];

tests.forEach(function(test){
	var rectangles = [];
	test.samples.forEach(function(sample){
		addRectangles(rectangles, sample);
	});
	var result = solver(rectangles),
		totalArea = getTotalArea(result.rectangles),
		size = getSize(result.rectangles, result.layout),
		filled = Math.round(100 * totalArea / size.area);
	console.log(test.name + ": " + filled + "% vs. " + test.filled + "%");
});

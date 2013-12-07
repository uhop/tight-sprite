"use strict";


function swapCoordinates(pos){
	return {
		i: pos.i,
		n: pos.n,
		x: pos.y,
		y: pos.x
	};
}


module.exports = function(layout){
	return layout.map(swapCoordinates);
};

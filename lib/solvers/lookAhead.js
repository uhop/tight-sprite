"use strict";


var Envelope = require("../Envelope");


// At each level we have:
//
// * current envelope
// * currently occupied (not wasted) area
// * a corner point number we should try
// * a rectangle we should try
//
// This is a classic stack-based algorithm. We should:
//
// 1. If we cannot use the corner point, we backtrack.
// 2. We try the corner point, saving the next corner point.
// 3. If our area criterium is negative, we backtrack.
// 4. Save an envelope, area, and start the corner point from 0.


module.exports = function(state, stack, depth, produceScore, acceptNewScore){
	var bestScore = null, bottom = stack.length - 1,
		rl = state.rectangles.length, limit = Math.min(rl, bottom + depth),
		mark, level, top, cp;
	while(stack.length > bottom){
		if(stack.length !== mark){
			level = stack.length - 1;
			top = stack[level];
			cp = top.envelope.cornerPoints;
			mark = stack.length;
		}
		if(level >= limit){
			// we placed all rectangles
			var score = produceScore(top, stack, state);
			scoring: {
				if(bestScore){
					for(var i = 0, n = score.length; i < n; ++i){
						if(score[i] < bestScore[i]){
							break;
						}
						if(score[i] > bestScore[i]){
							break scoring;
						}
					}
					if(i === n){
						break scoring;
					}
				}
				bestScore = score;
				acceptNewScore(score, state, stack, bottom, limit);
			}
			stack.pop();
			continue;
		}
		if(top.index >= cp.length){
			// we tried all corner points
			stack.pop();
			continue;
		}
		state.free(top.rectIndex, top.next);
		var next = state.getRectangle(top.next);
		if(!next){
			// we tried all rectangles
			++top.index;
			top.rectIndex = -1;
			top.next = null;
			continue;
		}
		top.rectIndex = next.index;
		top.next = next.next;
		var rect = state.rectangles[top.rectIndex],
			e = new Envelope(top.envelope), area = top.area + rect.area;
		e.add(top.index, rect);
		// prepare for the next cycle
		stack.push({envelope: e, area: area, index: 0, rectIndex: -1, next: null});
	}
	return bestScore;
};

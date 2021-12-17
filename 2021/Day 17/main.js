// https://adventofcode.com/2021/day/17
'use strict';
const assert = require('assert');
const fs = require('fs');

const TASKS = [
	{ filename: "test1.txt", exp1: 45, exp2: 112, /* contents: "" */ },
	// { filename: "test2.txt", exp1: 0, /* exp2: 0, */ /* contents: "" */ },
	// { filename: "test3.txt", exp1: 0, /* exp2: 0, */ /* contents: "" */ },
	{ filename: "input.txt", /* contents: "" */ },
];

class Probe {
	constructor(x, y, vx, vy) {
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
	}

	step() {
		this.x += this.vx;
		this.y += this.vy;
		this.vx -= Math.sign(this.vx);
		this.vy -= 1;
	}

	reach(x1, x2, y1, y2) {
		while(this.x < x2 && this.y > y1) {
			this.step();
			if(x1 <= this.x && this.x <= x2 && y2 >= this.y && this.y >= y1) {
				return true;
			}
		}

		return x1 <= this.x && this.x <= x2 && y2 >= this.y && this.y >= y1;
	}

	reset(x = 0, y = 0, vx = 0, vy = 0) {
		this.x = x;
		this.y = y;
		this.vx = vx;
		this.vy = vy;
	}
}

function isVXPossible(vx, tx1, tx2) {
	let x = 0;
	let wasIn = false;

	while(x <= tx2 && vx > 0) {
		wasIn = tx1 <= x && x <= tx2;
		x += vx;
		vx -= Math.sign(vx);
	}

	return wasIn;
}

function isVYPossible(vy, ty1, ty2) {
	let y = 0;
	let partialHigh = Number.MIN_SAFE_INTEGER;
	while(y >= ty1) {
		y += vy;
		vy -= 1;
		partialHigh = Math.max(partialHigh, y);
	}
	return [ty1 <= y - vy - 1 && y - vy - 1 <= ty2, partialHigh];
}

function part1(contents) {
	const [ty1, ty2] = contents.slice(2);
	let vy0 = ty1;
	let absHigh = Number.MIN_SAFE_INTEGER;

	while(vy0 <= -ty1) {
		const [possible, bestHigh] = isVYPossible(vy0, ty1, ty2);
		if(possible) {
			if(bestHigh > absHigh) {
				absHigh = bestHigh;
			}
		}
		++vy0;
	}

	return absHigh;
}

function part2(contents) {
	const [tx1, tx2, ty1, ty2] = contents;
	let [vx0, vy0] = [1, ty1];
	const possibleVXs = [];
	const possibleVYs = [];

	while(vx0 <= tx2) {
		const possible = isVXPossible(vx0, tx1, tx2);
		if(possible) {
			possibleVXs.push(vx0);
		}
		++vx0;
	}

	while(vy0 <= -ty1) {
		const [possible, _] = isVYPossible(vy0, ty1, ty2);
		if(possible) {
			possibleVYs.push(vy0);
		}
		++vy0;
	}

	let count = 0;
	for(const vx of possibleVXs) {
		for(const vy of possibleVYs) {
			const probe = new Probe(0, 0, vx, vy);
			if(probe.reach(tx1, tx2, ty1, ty2)) {
				++count;
			}
		}
	}
	return count;
}

function solveFile({ filename, exp1, exp2, contents }) {
	console.log(`Solving file "${filename}:"`);
	if(contents === undefined) {
		contents = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' }).slice(15).split(", y=").flatMap(l => l.split("..")).map(e => parseInt(e));
	}

	if(exp1 === undefined && exp2 === undefined) {	// Input file
		const res1 = part1(contents);
		const res2 = part2(contents);

		console.log(`Part 1: ${res1}`);	// 3570
		console.log(`Part 2: ${res2}`);	// 1919
		return;
	}

	if(exp1 !== undefined) {
		const res1 = part1(contents);
		assert(res1 === exp1, `Expected ${exp1} but found ${res1}`);
		console.log(`Part1: ✅`);
	}
	if(exp2 !== undefined) {
		const res2 = part2(contents);
		assert(res2 === exp2, `Expected ${exp2} but found ${res2}`);
		console.log(`Part2: ✅`);
	}
}

for(let task of TASKS) {
	solveFile(task);
	console.log();
}

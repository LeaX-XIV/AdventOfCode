// https://adventofcode.com/2021/day/5
'use strict';
const assert = require('assert');
const fs = require('fs');

const TASKS = [
	{ filename: "test1.txt", exp1: 5, exp2: 12 },
	{ filename: "input.txt" },
];

function part1(contents) {
	assert(contents.length % 4 === 0, "");
	const N = 1000;
	const grid = Array.from({ length: N }, (k, v) => Array.from({ length: N }, (k, v) => 0));
	let i;

	for(i = 0; i < contents.length; i += 4) {
		const [x1, y1, x2, y2] = contents.slice(i, i + 4);
		let startLine, endLine;

		if(x1 === x2) {	// Vertical
			startLine = Math.min(y1, y2);
			endLine = Math.max(y1, y2);

			while(startLine <= endLine) {
				grid[startLine++][x1] += 1;
			}
		} else if(y1 === y2) {	// Horizontal
			startLine = Math.min(x1, x2);
			endLine = Math.max(x1, x2);

			while(startLine <= endLine) {
				grid[y1][startLine++] += 1;
			}
		} else continue;
	}

	return grid.flatMap(e => e).filter(e => e > 1).length
}

function part2(contents) {
	assert(contents.length % 4 === 0, "");
	const N = 1000;
	const grid = Array.from({ length: N }, (k, v) => Array.from({ length: N }, (k, v) => 0));
	let i;

	for(i = 0; i < contents.length; i += 4) {
		let [x1, y1, x2, y2] = contents.slice(i, i + 4);
		let [dx, dy] = [x2 - x1, y2 - y1].map(e => Math.sign(e));

		while(x1 != x2 || y1 != y2) {
			grid[y1][x1] += 1;
			x1 += dx;
			y1 += dy;
		}
		grid[y1][x1] += 1;
	}

	return grid.flatMap(e => e).filter(e => e > 1).length
}

function solveFile({ filename, exp1, exp2, contents }) {
	console.log(`Solving file "${filename}:"`);
	if(contents === undefined) {
		contents = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' }).split(/\n|,| \-\> /).map(e => parseInt(e));
	}

	if(exp1 === undefined && exp2 === undefined) {	// Input file
		const res1 = part1(contents);
		const res2 = part2(contents);

		console.log(`Part 1: ${res1}`);	// 4745
		console.log(`Part 2: ${res2}`);	// 18442
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

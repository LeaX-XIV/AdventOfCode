// https://adventofcode.com/2021/day/25
'use strict';
const assert = require('assert');
const fs = require('fs');

const TASKS = [
	{ filename: "test1.txt", exp1: 58 },
	{ filename: "input.txt" },
];

function gridDump(grid) {
	console.log(grid.map(l => l.join('')).join('\n'))
}

function part1(contents) {
	let steps = 0;
	let moved = true;
	while(moved) {
		moved = false;
		for(const dir of ">v") {
			const toMove = new Map();
			for(let y = 0; y < contents.length; ++y) {
				for(let x = 0; x < contents[y].length; ++x) {
					if(contents[y][x] === dir) {
						const dst = dir === '>' ? [(x + 1) % contents[y].length, y] : [x, (y + 1) % contents.length];
						if(contents[dst[1]][dst[0]] === '.') {
							toMove.set(`${x},${y}`, dst);
							moved = true;
						}
					}
				}
			}
			toMove.forEach((dst, src) => {
				const [sx, sy] = src.split(',');
				const [dx, dy] = dst;
				const tmp = contents[sy][sx];
				contents[sy][sx] = '.';
				contents[dy][dx] = tmp;
			});
			toMove.clear();
		}
		++steps;
	}

	return steps;
}

function solveFile({ filename, exp1, exp2, contents }) {
	console.log(`Solving file "${filename}:"`);
	if(contents === undefined) {
		contents = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' }).split('\n').map(l => l.trim().split(''));
	}

	if(exp1 === undefined && exp2 === undefined) {	// Input file
		const res1 = part1(contents);

		console.log(`Part 1: ${res1}`);	// 482
		return;
	}

	if(exp1 !== undefined) {
		const res1 = part1(contents);
		assert(res1 === exp1, `Expected ${exp1} but found ${res1}`);
		console.log(`Part1: ✅`);
	}
}

for(let task of TASKS) {
	solveFile(task);
	console.log();
}

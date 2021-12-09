// https://adventofcode.com/2021/day/9
'use strict';
const assert = require('assert');
const fs = require('fs');

const TASKS = [
	{ filename: "test1.txt", exp1: 15, exp2: 1134 },
	{ filename: "input.txt" },
];

function getAdjs(grid, x, y) {
	const h = grid.length;
	const w = grid[0].length;

	const adjs = [];
	for(let dy = -1; dy <= 1; ++dy) {
		for(let dx = -1; dx <= 1; ++dx) {
			if((dy === 0) !== (dx === 0)) {
				if(0 <= y + dy && y + dy < h && 0 <= x + dx && x + dx < w) {
					adjs.push({ v: grid[y + dy][x + dx], x: x + dx, y: y + dy });
				}
			}
		}
	}

	assert(2 <= adjs.length && adjs.length <= 4, `Found ${adjs.length} adjacents ${adjs} for ${x}, ${y}, ${w}, ${h}`);
	return adjs;
}

function contains(arr, x) {
	return arr.some(y => y === x);
}

function getLowPoints(grid) {
	const h = grid.length;
	const w = grid[0].length;

	let lowPoints = [];

	for(let y = 0; y < h; ++y) {
		for(let x = 0; x < w; ++x) {
			const adjs = getAdjs(grid, x, y).map(o => o.v);
			if(!contains(adjs, grid[y][x]) && Math.min(grid[y][x], ...adjs) === grid[y][x]) {
				lowPoints.push({ v: grid[y][x], x: x, y: y });
			}
		}
	}

	return lowPoints;
}

function cellEq(a, b) {
	return a.v === b.v && a.x === b.x && a.y === b.y;
}

function countNines(grid) {
	return grid.flatMap(a => a).filter(n => n === 9).length;
}

function part1(contents) {
	return getLowPoints(contents).map(o => o.v + 1).reduce((a, b) => a + b);
}

function part2(contents) {
	const lowPoints = getLowPoints(contents);
	const basins = [];

	for(const lp of lowPoints) {
		const basin = [];
		basin.push(lp);

		for(let i = 0; i < basin.length; ++i) {
			const adjs = getAdjs(contents, basin[i].x, basin[i].y);
			for(const a of adjs) {
				if(a.v !== 9 && a.v - basin[i].v >= 1 && basin.every(b => !cellEq(b, a))) {
					basin.push(a);
				}
			}
		}
		basins.push(basin.length);
	}
	assert(basins.reduce((a, b) => a + b) + countNines(contents) === contents.length * contents[0].length,
		`${basins.reduce((a, b) => a + b)} + ${countNines(contents)} = ${basins.reduce((a, b) => a + b) + countNines(contents)} === ${contents.length} * ${contents[0].length} = ${contents.length * contents[0].length}`);

	basins.sort((a, b) => b - a);
	return basins[0] * basins[1] * basins[2];
}

function solveFile({ filename, exp1, exp2, contents }) {
	console.log(`Solving file "${filename}:"`);
	if(contents === undefined) {
		contents = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' }).split('\r\n').map(line => line.split('').map(digit => parseInt(digit)));
	}

	if(exp1 === undefined && exp2 === undefined) {	// Input file
		const res1 = part1(contents);
		const res2 = part2(contents);

		console.log(`Part 1: ${res1}`);	// 548
		console.log(`Part 2: ${res2}`);	// 786048
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

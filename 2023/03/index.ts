// https://adventofcode.com/2023/day/3

import assert = require('assert');
import fs = require('fs');

type Result = number;

type Task = Partial<{
	filename: string;
	exp1: Result;
	exp2: Result;
	contents: string;
}>;

const TASKS: Task[] = [
	{
		filename: "test1.txt",
		exp1: 4361,
		exp2: 467835,
	},
	{
		filename: "input.txt"
	},
];

type Tile = number;

type Map = Tile[][];

const getTile = (c: string, index: number, line: string): Tile => {
	if (c === '.') return 0;

	if (c.match(/\d/)) {
		const n = index === 0 ? 0 : getTile(line[index-1], index-1, line);
		if (n > 0)
			return n;

		return Number.parseInt(line.substring(index));
	}

	return NaN;
}

const getAdjs = (grid: Map, x: number, y: number): number[] => {
	const dxs = [-1, 0, 1];
	const dys = [-1, 0, 1];

	const arr = [];

	for (const dx of dxs) {
		for (const dy of dys) {
			if (dx === 0 &&  dy === 0)
				continue;

			const _x = x + dx;
			const _y = y + dy;

			if (_x < 0 || _x >= grid[0].length || _y < 0 || _y >= grid.length)
				continue;

			if (!Number.isNaN(grid[_y][_x])) {
				arr.push(grid[_y][_x]);
				// grid[_y][_x] = 0; Assuming no two symbols are adjacent to the same part number
			}
		}
	}

	const s = new Set(arr);
	return Array.from(s).filter(n => n > 0);
}

function part1(contents: string): Result {	
	const grid: Map = contents.split(/\r?\n\r?/).map(line => line.split("").map((c, i) => getTile(c, i, line)));

	let sum = 0;

	for (let j = 0; j < grid.length; j++) {
		for (let i = 0; i < grid[j].length; i++) {
			const tile: Tile = grid[j][i];

			if (Number.isNaN(tile)) {
				sum += getAdjs(grid, i, j).reduce((a, b) => a + b, 0);
			}
		}
	}

	return sum;
}

const getTile2 = (c: string, index: number, line: string): Tile => {
	if (c === '*')
		return NaN;

	if (c.match(/\d/)) {
		const n = index === 0 ? 0 : getTile(line[index-1], index-1, line);
		if (n > 0)
			return n;

		return Number.parseInt(line.substring(index));
	}

	return 0;
}

function part2(contents: string): Result {
	const grid: Map = contents.split(/\r?\n\r?/).map(line => line.split("").map((c, i) => getTile2(c, i, line)));

	let sum = 0;

	for (let j = 0; j < grid.length; j++) {
		for (let i = 0; i < grid[j].length; i++) {
			const tile: Tile = grid[j][i];

			if (Number.isNaN(tile)) {
				const adj = getAdjs(grid, i, j);

				if (adj.length === 2) {
					sum += adj[1] * adj[0];
				}
			}
		}
	}

	return sum;
}

function solveFile({ filename, exp1, exp2, contents }: Task) {
	console.log(`Solving file "${filename}:"`);
	if(contents === undefined) {
		contents = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
	}

	if(exp1 === undefined && exp2 === undefined) {	// Input file
		const res1 = part1(contents!);
		const res2 = part2(contents!);

		console.log(`Part 1: ${res1}`);
		console.log(`Part 2: ${res2}`);
		return;
	}

	if(exp1 !== undefined) {
		const res1 = part1(contents!);
		assert(res1 === exp1, `Expected ${exp1} but found ${res1}`);
		console.log(`Part1: ✅`);
	}
	if(exp2 !== undefined) {
		const res2 = part2(contents!);
		assert(res2 === exp2, `Expected ${exp2} but found ${res2}`);
		console.log(`Part2: ✅`);
	}
}

for(let task of TASKS) {
	solveFile(task);
	console.log();
}

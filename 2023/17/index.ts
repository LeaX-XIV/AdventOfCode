// https://adventofcode.com/2023/day/17

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
		exp1: 102,
		// exp2: 0,
		// contents: ``
	},
	// {
	// 	filename: "test2.txt",
	// 	// exp1: 0,
	// 	// exp2: 0,
	// 	// contents: ``
	// },
	// {
	// 	filename: "test3.txt",
	// 	// exp1: 0,
	// 	// exp2: 0,
	// 	// contents: ``
	// },
	{
		filename: "input.txt"
		// contents: ``
	},
];

type Coords = {
	x: number;
	y: number;
};

type State = {
	c: Coords;
	d: Coords;
	linSteps: number;
};

const memo = new Map<string, number>();
const minPath = (grid: number[][], _from: State, to: Coords): number => {
	// console.log(from)
	const stack: State[] = [ _from ];
	while (stack.length > 0) {
		const from = stack.pop();

		const key = JSON.stringify(from);

		// Memoization check
		if (memo.has(key)) {
			continue;
		}

		// Cycle check
		if (stack.map(state => JSON.stringify(state)).some(state => state === JSON.stringify(from))) {
			continue;
		}

		// Boundary check
		if (from.c.x < 0 || from.c.x >= grid[0].length || from.c.y < 0 || from.c.y >= grid.length) {
			memo.set(key, Infinity);
			continue;
		}

		// // End check
		if (from.c.x === to.x && from.c.y === to.y) {
			console.log("found");
			memo.set(key, grid[to.y][to.x]);
			continue;
		}

		let min = Infinity;
		let newFroms: State[]= [];
		// Movement following direction
		if (from.linSteps > 0) {
			newFroms.push({ c: { x: from.c.x + from.d.x, y: from.c.y + from.d.y }, d: from.d, linSteps: from.linSteps - 1 });
		}

		// Movement after turn
		let newDirs: Coords[];
		if (from.d.x === 0) {
			newDirs = [ { x: -1, y: 0 }, { x: +1, y: 0 } ];
		} else if (from.d.y === 0) {
			newDirs = [ { x: 0, y: -1 }, { x: 0, y: +1 } ];
		}

		for (const dir of newDirs) {
			newFroms.push({ c: { x: from.c.x + dir.x, y: from.c.y + dir.y }, d: dir, linSteps: 3 });
		}

		// Probably ends stuck in an infinite loop checking the same state over and over
		if (!memo.has(JSON.stringify(newFroms[0]))) {
			stack.push(from);
			newFroms.forEach(newFrom => stack.push(newFrom));
		} else {
			min = Math.min(...newFroms.map(newFrom => memo.get(JSON.stringify(newFrom))).filter(n => n && Number.isFinite(n))) + grid[from.c.y][from.c.x];
			console.log(from, min)
			memo.set(key, min);
		}
	}

	return memo.get(JSON.stringify(_from));
}

function part1(contents: string): Result {
	const grid: number[][] = contents.split(/\r?\n\r?/).map(line => line.split("").map(c => Number(c)));


	const res = minPath(grid, { c: { x: 0, y: 0 }, d: { x: 1, y: 0 }, linSteps: 3 }, { x: grid[0].length - 1, y: grid.length - 1 }) - grid[0][0];

	console.log(memo)

	return res;

	

	return 0;
}

function part2(contents: string): Result {
	return 0;
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

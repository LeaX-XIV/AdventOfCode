// https://adventofcode.com/2023/day/18

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
		exp1: 62,
		exp2: 952408144115,
	},
	{
		filename: "input.txt"
	},
];

type Coords = {
	x: number;
	y: number;
};

const dirs: {[key: string]: Coords} = {
	"U": { x: 0, y: -1 },
	"R": { x: +1, y: 0 },
	"D": { x: 0, y: +1 },
	"L": { x: -1, y: 0 },
};

type Instruction = {
	d: string,
	steps: number;
	color: string;
};

function part1(contents: string): Result {
	const grid = new Map<string, boolean>();

	const instructions: Instruction[] = contents
		.split(/\r?\n\r?/)
		.map(line => {
			const parts = line.split(" ");
			return { d: parts[0], steps: Number(parts[1]), color: parts[2].substring(2, 8) };
		});

	const current: Coords = { x: 0, y: 0 };
	grid.set(JSON.stringify(current), true);

	let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

	for (const inst of instructions) {
		for (let i = 0; i < inst.steps; ++i) {
			current.x += dirs[inst.d].x;
			current.y += dirs[inst.d].y;

			minX = Math.min(minX, current.x);
			minY = Math.min(minY, current.y);
			maxX = Math.max(maxX, current.x);
			maxY = Math.max(maxY, current.y);

			grid.set(JSON.stringify(current), true);
		}
	}

	const buf: Coords[] = [ { x: 1, y: 1 } ];

	while (buf.length > 0) {
		const cur = buf.pop();

		if (grid.has(JSON.stringify(cur))) {
			continue;
		}

		grid.set(JSON.stringify(cur), true);

		buf.push(
			{ x: cur.x + dirs["U"].x, y: cur.y + dirs["U"].y },
			{ x: cur.x + dirs["L"].x, y: cur.y + dirs["L"].y },
			{ x: cur.x + dirs["D"].x, y: cur.y + dirs["D"].y },
			{ x: cur.x + dirs["R"].x, y: cur.y + dirs["R"].y },
		);
	}

	return grid.size;
}

function part2(contents: string): Result {
	const grid = new Map<string, boolean>();

	const instructions: Instruction[] = contents
		.split(/\r?\n\r?/)
		.map(line => {
			const parts = line.split(" ");
			return { d: ["R", "D", "L", "U"][Number(parts[2].charAt(7))], steps: Number.parseInt(parts[2].substring(2, 7), 16), color: "" };
		});

	const current: Coords = { x: 0, y: 0 };
	grid.set(JSON.stringify(current), true);

	let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;

	// This is super slow, but it works
	for (const inst of instructions) {
		for (let i = 0; i < inst.steps; ++i) {
			current.x += dirs[inst.d].x;
			current.y += dirs[inst.d].y;

			minX = Math.min(minX, current.x);
			minY = Math.min(minY, current.y);
			maxX = Math.max(maxX, current.x);
			maxY = Math.max(maxY, current.y);

			grid.set(JSON.stringify(current), true);
		}
	}

	// Flood fill runs out of memory. Use pathfinding: if reach edge, is outside.
	// const buf: Coords[] = [ { x: 1, y: 1 } ];

	// while (buf.length > 0) {
	// 	const cur = buf.pop();

	// 	if (grid.has(JSON.stringify(cur))) {
	// 		continue;
	// 	}

	// 	grid.set(JSON.stringify(cur), true);

	// 	buf.push(
	// 		{ x: cur.x + dirs["U"].x, y: cur.y + dirs["U"].y },
	// 		{ x: cur.x + dirs["L"].x, y: cur.y + dirs["L"].y },
	// 		{ x: cur.x + dirs["D"].x, y: cur.y + dirs["D"].y },
	// 		{ x: cur.x + dirs["R"].x, y: cur.y + dirs["R"].y },
	// 	);
	// }

	return grid.size;
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

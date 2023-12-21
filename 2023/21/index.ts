// https://adventofcode.com/2023/day/21

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
		exp1: 42,
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

const dirs = [
	{ x: 0, y: -1 },
	{ x: +1, y: 0 },
	{ x: 0, y: +1 },
	{ x: -1, y: 0 },
];

const parseGrid = (contents: string): { start: Coords, walkable: Map<string, boolean>, minX: number, maxX: number, minY: number, maxY: number } => {
	let start: Coords;

	const grid: string[][] = contents.split(/\r?\n\r?/)
		.map((line, y) => line.split('')
			.map((c, x) => {
				if (c === 'S') {
					start = { x, y };
					c = '.';
				}
				return c;
			}));

	const walkable = new Map(
		grid.flatMap((line, y) => line.map((c, x) => ({ key: JSON.stringify({ x, y }), value: c === '.' })).map(({key, value}) => [ key, value ]))
	)

	return { start, walkable, minX: 0, minY: 0, maxX: grid[0].length, maxY: grid.length };
}

function part1(contents: string): Result {
	const { start, walkable, minX, minY, maxX, maxY } = parseGrid(contents);

	let superpositions = new Set([ JSON.stringify(start) ]);
	const newPositions: Set<string> = new Set();

	for (let i = 0; i < 64; ++i) {
		newPositions.clear();

		for (const posStr of Array.from(superpositions.values())) {
			const pos: Coords = JSON.parse(posStr);

			for (const dir of dirs) {
				const newPos = { x: pos.x + dir.x, y: pos.y + dir.y };

				if (newPos.x < minX || newPos.x >= maxX || newPos.y < minY || newPos.y >= maxY)
					continue;

				if (!walkable.get(JSON.stringify(newPos)))
					continue;

				newPositions.add(JSON.stringify(newPos));
			}
		}
		superpositions = new Set(newPositions);
	}

	return superpositions.size;
}

function part2(contents: string): Result {
	const { start, walkable, minX, minY, maxX, maxY } = parseGrid(contents);

	let superpositions = new Set([ JSON.stringify(start) ]);
	const newPositions: Set<string> = new Set();

	for (let i = 0; i < 26501365; ++i) {
		newPositions.clear();

		for (const posStr of Array.from(superpositions.values())) {
			const pos: Coords = JSON.parse(posStr);

			for (const dir of dirs) {
				const newPos = { x: pos.x + dir.x, y: pos.y + dir.y };
				const newPosNormalized = { x: newPos.x % maxX, y: newPos.y % maxY };

				if (!walkable.get(JSON.stringify(newPosNormalized)))
					continue;

				newPositions.add(JSON.stringify(newPos));
			}
		}
		superpositions = new Set(newPositions);
	}

	return superpositions.size;
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

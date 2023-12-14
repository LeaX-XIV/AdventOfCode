// https://adventofcode.com/2023/day/14

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
		exp1: 136,
		exp2: 64,
	},
	{
		filename: "input.txt"
	},
];

type Coords = {
	x: number,
	y: number
};

const parseContents = (contents: string): { roundRocks: Map<string, Coords>, cubeRocks: Map<string, Coords> } => {
	const roundRocks = new Map<string, Coords>();
	const cubeRocks = new Map<string, Coords>();

	const lines = contents.split(/\r?\n\r?/);

	contents
		.split(/\r?\n\r?/)
		.flatMap((line, y) => line.split("").map((c, x) => ({ value: c, x, y})))
		.forEach(({value, x, y}) => {
			if (value === "O") {
				roundRocks.set(`${x}-${y}`, { x, y });
			} else if (value === "#") {
				cubeRocks.set(`${x}-${y}`, { x, y });
			}
		});

	for (let x = 0; x < contents.indexOf("\n"); ++x) {
		cubeRocks.set(`${x}-${-1}`, { x, y: -1 });
		cubeRocks.set(`${x}-${lines.length}`, { x, y: -1 });
	}
	for (let y = 0; y < lines.length; ++y) {
		cubeRocks.set(`${-1}-${y}`, { x: -1, y });
		cubeRocks.set(`${lines[0].length}-${y}`, { x: lines[0].length, y });
	}

	return { roundRocks, cubeRocks };
}

function part1(contents: string): Result {
	const { roundRocks, cubeRocks } = parseContents(contents);

	const tiltedRound = new Map<string, Coords>();

	Array.from(roundRocks.values())
		.sort((c1, c2) => c1.y - c2.y)
		.forEach(({ x, y }) => {
			let newY: number;
			for (newY = y - 1; !cubeRocks.has(`${x}-${newY}`) && !tiltedRound.has(`${x}-${newY}`); --newY);
			tiltedRound.set(`${x}-${newY + 1}`, { x, y: newY + 1 });
		});

	const totRows = contents.split(/\r?\n\r?/).length;

	return Array.from(tiltedRound.values()).map(({y}) => totRows - y).reduce((a, b) => a + b, 0);
}

const sameCoords = (c1: Coords[], c2: Coords[]): boolean => {
	if (c1.length !== c2.length)
		return false;

	return c1.every(c => c2.some(o => c.x === o.x && c.y === o.y));
}

function part2(contents: string): Result {
	let { roundRocks, cubeRocks } = parseContents(contents);

	let tiltedRoundRocks = new Map<string, Coords>();

	const state = new Map<number, Set<Coords>>();

	for (let i = 0; i < 1000000000; ++i) {
		const matchingIds: number[] = Array.from(state.entries())
			.filter(([_, rocks]) => sameCoords(Array.from(rocks), Array.from(roundRocks.values())))
			.map(([id, _]) => id);

		if (matchingIds.length === 0) {
			state.set(i, new Set(roundRocks.values()));
		} else {
			const period = i - matchingIds[0];
			const stateId = ((1000000000 - matchingIds[0]) % period) + matchingIds[0];

			tiltedRoundRocks.clear();
			state.get(stateId).forEach(coord => tiltedRoundRocks.set(`${coord.x}-${coord.y}`, coord));
			break;
		}

		tiltedRoundRocks.clear();
		
		// North
		Array.from(roundRocks.values())
			.sort((c1, c2) => c1.y - c2.y)
			.forEach(({ x, y }) => {
				let newY: number;
				for (newY = y - 1; !cubeRocks.has(`${x}-${newY}`) && !tiltedRoundRocks.has(`${x}-${newY}`); --newY);
				tiltedRoundRocks.set(`${x}-${newY + 1}`, { x, y: newY + 1 });
			});

		roundRocks = new Map(tiltedRoundRocks);
		tiltedRoundRocks.clear();

		// West
		Array.from(roundRocks.values())
			.sort((c1, c2) => c1.x - c2.x)
			.forEach(({ x, y }) => {
				let newX: number;
				for (newX = x - 1; !cubeRocks.has(`${newX}-${y}`) && !tiltedRoundRocks.has(`${newX}-${y}`); --newX);
				tiltedRoundRocks.set(`${newX + 1}-${y}`, { x: newX + 1, y });
			});

		roundRocks = new Map(tiltedRoundRocks);
		tiltedRoundRocks.clear();

		// South
		Array.from(roundRocks.values())
			.sort((c1, c2) => c2.y - c1.y)
			.forEach(({ x, y }) => {
				let newY: number;
				for (newY = y + 1; !cubeRocks.has(`${x}-${newY}`) && !tiltedRoundRocks.has(`${x}-${newY}`); ++newY);
				tiltedRoundRocks.set(`${x}-${newY - 1}`, { x, y: newY - 1 });
			});

		roundRocks = new Map(tiltedRoundRocks);
		tiltedRoundRocks.clear();

		// East
		Array.from(roundRocks.values())
			.sort((c1, c2) => c2.x - c1.x)
			.forEach(({ x, y }) => {
				let newX: number;
				for (newX = x + 1; !cubeRocks.has(`${newX}-${y}`) && !tiltedRoundRocks.has(`${newX}-${y}`); ++newX);
				tiltedRoundRocks.set(`${newX - 1}-${y}`, { x: newX - 1, y });
			});

		roundRocks = new Map(tiltedRoundRocks);
	}

	const totRows = contents.split(/\r?\n\r?/).length;

	return Array.from(tiltedRoundRocks.values()).map(({y}) => totRows - y).reduce((a, b) => a + b, 0);
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

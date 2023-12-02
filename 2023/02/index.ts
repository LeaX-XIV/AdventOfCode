// https://adventofcode.com/2023/day/2

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
		exp1: 8,
		exp2: 2286,
	},
	{
		filename: "input.txt"
	},
];

const enum Cube {
	RED, BLUE, GREEN
}

type Set = {
	n: number;
	c: Cube;
}

type Bag = {
	index: number;
	sets: Set[];
}

const parseLine = (l: string): Bag => {
	const bag: Bag = { index: 0, sets: [] };

	bag.index = Number(l.split(":")[0].substring("Game ".length));

	for (const set of l.split(": ")[1].split("; ")) {
		for (const type of set.split(", ")) {
			const setObj = { n: 0, c: Cube.RED };

			const [n, color] = type.split(" ");
			setObj.n = Number(n);

			switch(color.trim()) {
				case "red": setObj.c = Cube.RED; break;
				case "blue": setObj.c = Cube.BLUE; break;
				case "green": setObj.c = Cube.GREEN; break;
				default: throw new Error(color);
			}
			bag.sets.push(setObj);
		}
	}

	return bag;
}

const MAX_REDS = 12;
const MAX_GREENS = 13;
const MAX_BLUES = 14;

function part1(contents: string): Result {
	const lines: string[] = contents.split("\n");
	let sum = 0;

	for (const line of lines) {
		const bag = parseLine(line);

		const redOk = bag.sets.filter(s => s.c === Cube.RED).every(s => s.n <= MAX_REDS);
		const blueOk = bag.sets.filter(s => s.c === Cube.BLUE).every(s => s.n <= MAX_BLUES);
		const greenOk = bag.sets.filter(s => s.c === Cube.GREEN).every(s => s.n <= MAX_GREENS);

		if (redOk && blueOk && greenOk)
			sum += bag.index;
	}

	return sum;
}

function part2(contents: string): Result {
	const lines: string[] = contents.split("\n");
	let sum = 0;

	for (const line of lines) {
		const bag = parseLine(line);

		const minReds = Math.max(...bag.sets.filter(s => s.c === Cube.RED).map(s => s.n));
		const minBlues = Math.max(...bag.sets.filter(s => s.c === Cube.BLUE).map(s => s.n));
		const minGreens = Math.max(...bag.sets.filter(s => s.c === Cube.GREEN).map(s => s.n));

		const power = minBlues * minGreens * minReds;

		sum += power;
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

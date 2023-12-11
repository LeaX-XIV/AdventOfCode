// https://adventofcode.com/2023/day/11

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
		exp1: 374,
	},
	{
		filename: "input.txt"
	},
];

type Coords = {
	x: number;
	y: number;
};

const parseContents = (contents: string): [Coords[], Set<number>, Set<number>] => {
	let lines = contents.split(/\r?\n\r?/);

	const cols = new Set<number>(), rows = new Set<number>();

	for (let x = lines[0].length - 1; x >= 0; --x) {
		if (lines.every(line => line[x] === "."))
			cols.add(x);

		if (lines[x].match(/^\.+$/))
			rows.add(x);
	}

	const galaxies = []
	for (let y = 0; y < lines.length; ++y)
		for (let x = 0; x < lines[y].length; ++x)
			if (lines[y][x] === "#")
				galaxies.push({ x, y });

	return [galaxies, cols, rows];
}

const solveWithExpansion = (contents: string, expansion: number): number => {
	const [galaxies, cols, rows] = parseContents(contents);

	let tot = 0;
	for (let i = 0; i < galaxies.length; ++i) {
		for (let j = i + 1; j < galaxies.length; ++j) {
			let minX = Math.min(galaxies[i].x, galaxies[j].x);
			let maxX = Math.max(galaxies[i].x, galaxies[j].x);
			for (let x = minX; x < maxX; ++x) {
				if (cols.has(x))
					tot += expansion;
				else
					tot += 1;
			}

			let minY = Math.min(galaxies[i].y, galaxies[j].y);
			let maxY = Math.max(galaxies[i].y, galaxies[j].y);
			for (let y = minY; y < maxY; ++y) {
				if (rows.has(y))
					tot += expansion;
				else
					tot += 1;
			}
		}
	}

	return tot;
}

function part1(contents: string): Result {
	return solveWithExpansion(contents, 2);
}

function part2(contents: string): Result {
	return solveWithExpansion(contents, 1_000_000);
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

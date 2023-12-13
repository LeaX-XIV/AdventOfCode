// https://adventofcode.com/2023/day/13

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
		exp1: 405,
		exp2: 400,
	},
	{
		filename: "input.txt"
	},
];

type Block = string[];

const countDiffs = (a: string, b: string): number => {
	let n = 0;
	for (let i = 0; i < a.length; ++i)
		if (a.charAt(i) !== b.charAt(i))
			++n;

	return n;
}

const findHorizontalSymmetry = (block: Block, allowedDifferences: number): number | null => {
	for (let i = 1; i < block.length; ++i) {
		let cumulativeDiffs = 0;
		for (let j = 0; i + j < block.length && i - j > 0; ++j) {
			const row1 = block[i + j];
			const row2 = block[i - j - 1];
			cumulativeDiffs += countDiffs(row1, row2);
		}
		if (cumulativeDiffs === allowedDifferences)
			return i;
	}
	return null;
}

const findVerticalSymmetry = (block: Block, allowedDifferences: number): number | null => {
	for (let i = 1; i < block[0].length; ++i) {
		let cumulativeDiffs = 0;
		for (let j = 0; i + j < block[0].length && i - j > 0; ++j) {
			const col1 = block.map(line => line.charAt(i + j)).join("");
			const col2 = block.map(line => line.charAt(i - j - 1)).join("");
			cumulativeDiffs += countDiffs(col1, col2);
		}
		if (cumulativeDiffs === allowedDifferences)
			return i;
	}
	return null;
}

const parseContents = (contents: string): Block[] => contents.split(/\r?\n\r?\n\r?/).map(block => block.split(/\r?\n\r?/));

function part1(contents: string): Result {
	return parseContents(contents)
		.map(block => {
			// Lines
			const hor = findHorizontalSymmetry(block, 0);
			if (hor !== null)
				return 100 * hor;
			
			// Columns
			const ver = findVerticalSymmetry(block, 0);
			if (ver !== null)
				return ver;

			return 0;
		}).reduce((a, b) => a + b, 0);
}

function part2(contents: string): Result {
	return parseContents(contents)
		.map(block => {
			// Lines
			const hor = findHorizontalSymmetry(block, 1);
			if (hor !== null)
				return 100 * hor;
			
			// Columns
			const ver = findVerticalSymmetry(block, 1);
			if (ver !== null)
				return ver;

			return 0;
		}).reduce((a, b) => a + b, 0);
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

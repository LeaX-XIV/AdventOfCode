// https://adventofcode.com/2023/day/9

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
		exp1: 114,
		exp2: 2,
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

type History = number[];

const parseHistories = (contents: string): History[] => {
	return contents
		.split(/\r?\n\r?/)
		.map(line => line.split(" ").map(n => Number(n)) as History);
}

const computeDerivative = (history: History): History => {
	const newHistory = Array(history.length - 1);

	for (let i = 0; i < newHistory.length; ++i) {
		newHistory[i] = history[i + 1] - history[i];
	}

	return newHistory;
}

const getDerivativesUntilConstant = (history: History): History[] => {
	const diffs: History[] = [history];
	while (diffs[diffs.length - 1].some(n => n !== 0)) {
		diffs.push(computeDerivative(diffs[diffs.length - 1]));
	}
	return diffs;
}

function part1(contents: string): Result {
	const originalHistories = parseHistories(contents);

	const nextValues = originalHistories.map(history => {
		const diffs = getDerivativesUntilConstant(history);

		let newValue = 0;
		for (let i = diffs.length - 1; i >= 0; --i) {
			newValue += diffs[i][diffs[i].length - 1];
		}
		return newValue;
	});

	return nextValues.reduce((a, b) => a + b, 0);
}

function part2(contents: string): Result {
	const originalHistories = parseHistories(contents);

	const nextValues = originalHistories.map(history => {
		const diffs = getDerivativesUntilConstant(history);

		let newValue = 0;
		for (let i = diffs.length - 1; i >= 0; --i) {
			newValue = diffs[i][0] - newValue;
		}
		return newValue;
	});

	return nextValues.reduce((a, b) => a + b, 0);
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

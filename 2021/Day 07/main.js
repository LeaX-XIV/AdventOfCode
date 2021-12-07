// https://adventofcode.com/2021/day/7
'use strict';
const assert = require('assert');
const fs = require('fs');

const TASKS = [
	{ filename: "test1.txt", exp1: 37, exp2: 168 },
	{ filename: "input.txt" },
];

function median(values) {
	if(values.length === 0) return 0;

	values.sort((a, b) => a - b);

	const half = Math.floor(values.length / 2);
	if(values.length % 2) {
		return values[half];
	}

	return (values[half - 1] + values[half]) / 2;
}

function avg(values) {
	if(values.length === 0) return 0;

	return values.reduce((a, b) => a + b) / values.length;
}

function part1(contents) {
	const medianValue = median(contents);

	return contents
		.map(xPos => Math.abs(xPos - medianValue))
		.reduce((a, b) => a + b);
}

function part2(contents) {
	return Math.min(...[avg(contents)]
		.flatMap(v => [Math.floor(v), Math.ceil(v)])
		.map(v => contents
			.map(xPos => Math.abs(xPos - v))
			.map(dist => (dist * (dist + 1)) / 2)
			.reduce((a, b) => a + b)
		));
}

function solveFile({ filename, exp1, exp2, contents }) {
	console.log(`Solving file "${filename}:"`);
	if(contents === undefined) {
		contents = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' }).split(',').map(e => parseInt(e));
	}

	if(exp1 === undefined && exp2 === undefined) {	// Input file
		const res1 = part1(contents);
		const res2 = part2(contents);

		console.log(`Part 1: ${res1}`);	// 342534
		console.log(`Part 2: ${res2}`);	// 94004208
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

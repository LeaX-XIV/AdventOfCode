// https://adventofcode.com/2021/day/1
'use strict';
const assert = require('assert');
const fs = require('fs');

const TASKS = [
	{ filename: "test1.txt", exp1: 7, exp2: 5 },
	{ filename: "input.txt" },
];

function part1(contents) {
	const measures = contents.split('\n').map(str => parseInt(str));
	return cmpBefore(measures, 1);
}

function part2(contents) {
	const measures = contents.split('\n').map(str => parseInt(str));
	return cmpBefore(measures, 3);
}

function cmpBefore(arr, d) {
	let count = 0;
	for(let i = d; i < arr.length; ++i) {
		if(arr[i] > arr[i - d]) {
			++count;
		}
	}
	return count;
}

function solveFile({ filename, exp1, exp2, contents }) {
	console.log(`Solving file "${filename}:"`);
	if(contents === undefined) {
		contents = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
	}

	if(exp1 === undefined && exp2 === undefined) {	// Input file
		const res1 = part1(contents);
		const res2 = part2(contents);

		console.log(`Part 1: ${res1}`);	// 1288
		console.log(`Part 2: ${res2}`);	// 1311
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

// https://adventofcode.com/2021/day/6
'use strict';
const assert = require('assert');
const fs = require('fs');

const TASKS = [
	{ filename: "test1.txt", exp1: 5934, exp2: 26984457539 },
	{ filename: "input.txt" },
];

const mem = [];
function countBirths(fish, days) {
	if(days <= 0) return 0;

	if(`${fish}, ${days}` in mem) {
		return mem[`${fish}, ${days}`];
	}

	let partial = 1;
	for(let i = days - fish; ; i -= 7) {
		const birthed = countBirths(9, i);
		if(birthed === 0) {
			mem[`${fish}, ${days}`] = partial;
			return mem[`${fish}, ${days}`];
		}

		partial += birthed;
	}
}

function part1(contents) {
	return contents.map(e => countBirths(e, 80)).reduce((a, b) => a + b);
}

function part2(contents) {
	return contents.map(e => countBirths(e, 256)).reduce((a, b) => a + b);
}

function solveFile({ filename, exp1, exp2, contents }) {
	console.log(`Solving file "${filename}:"`);
	if(contents === undefined) {
		contents = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' }).split(',').map(e => parseInt(e));
	}

	if(exp1 === undefined && exp2 === undefined) {	// Input file
		const res1 = part1(contents);
		const res2 = part2(contents);

		console.log(`Part 1: ${res1}`);	// 393019
		console.log(`Part 2: ${res2}`);	// 1757714216975
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

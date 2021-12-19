// https://adventofcode.com/2021/day/19
'use strict';
const assert = require('assert');
const fs = require('fs');

const TASKS = [
	{ filename: "test1.txt", exp1: 3, /* exp2: 0, */ /* contents: "" */ },
	{ filename: "test2.txt", exp1: 79, /* exp2: 0, */ /* contents: "" */ },
	// { filename: "test3.txt", exp1: 0, /* exp2: 0, */ /* contents: "" */ },
	{ filename: "input.txt", /* contents: "" */ },
];

function fromContents(nScanner, posBeacons) {
	return { scanner: nScanner, beacons: Array.from(posBeacons, v => { return { x: v[0] || 0, y: v[1] || 0, z: v[2] || 0 }; }) };
}

function part1(contents) {
	const overlap_threshold = contents.length === 2 ? 3 : 12;	// To allow simple input

	return 0;
}

function part2(contents) {
	return 0;
}

function solveFile({ filename, exp1, exp2, contents }) {
	console.log(`Solving file "${filename}:"`);
	if(contents === undefined) {
		contents = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' })
			.split('\r\n\r\n')
			.map(s => s.slice(12))
			.map(f => f.split(" ---\r\n")
				.map((t, i) => {
					if(i === 0) return parseInt(t);
					else return t.split('\r\n')
						.map(l => l.split(',').map(n => parseInt(n)));
				})
			)
			.map(m => fromContents(m[0], m[1]));
	}

	if(exp1 === undefined && exp2 === undefined) {	// Input file
		const res1 = part1(contents);
		const res2 = part2(contents);

		console.log(`Part 1: ${res1}`);
		console.log(`Part 2: ${res2}`);
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

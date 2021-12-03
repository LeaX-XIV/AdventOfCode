// https://adventofcode.com/2021/day/3
'use strict';
const assert = require('assert');
const fs = require('fs');

const TASKS = [
	{ filename: "test1.txt", exp1: 198, exp2: 230 },
	{ filename: "input.txt" },
];

function countOnes(arr, pos) {
	let ones = 0;
	arr.forEach(c => {
		if(c[pos] === '1') {
			ones++;
		}
	});

	return ones;
}

function countZeros(arr, pos) {
	return arr.length - countOnes(arr, pos);
}

function part1(contents) {
	let gamma = 0;

	for(let i = 0; i < contents[0].length; ++i) {
		let ones = countOnes(contents, i);

		if(ones > contents.length / 2) {
			gamma |= 1 << (contents[0].length - i - 1);
		}
	}
	const epsilon = ~gamma & ((2 ** contents[0].length) - 1);

	return gamma * epsilon;
}

function part2(contents) {
	let oxygen = contents.filter(a => true);
	let co2 = contents.filter(a => true);

	let i = 0;
	do {
		const ones = countOnes(oxygen, i);
		const zeros = countZeros(oxygen, i);

		if(ones >= zeros) {
			oxygen = oxygen.filter(s => s[i] === '1');
		} else {
			oxygen = oxygen.filter(s => s[i] === '0');
		}
		++i;
	} while(oxygen.length > 1);

	i = 0;
	do {
		const ones = countOnes(co2, i);
		const zeros = countZeros(co2, i);

		if(ones < zeros) {
			co2 = co2.filter(s => s[i] === '1');
		} else {
			co2 = co2.filter(s => s[i] === '0');
		}
		++i;
	} while(co2.length > 1);

	return parseInt(oxygen[0], 2) * parseInt(co2[0], 2);
}

function solveFile({ filename, exp1, exp2, contents }) {
	console.log(`Solving file "${filename}:"`);
	if(contents === undefined) {
		contents = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' }).split('\n').map(s => s.trim());
	}

	if(exp1 === undefined && exp2 === undefined) {	// Input file
		const res1 = part1(contents);
		const res2 = part2(contents);

		console.log(`Part 1: ${res1}`);	// 2724524
		console.log(`Part 2: ${res2}`);	// 2775870
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

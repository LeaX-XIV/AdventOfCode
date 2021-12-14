// https://adventofcode.com/2021/day/14
'use strict';
const assert = require('assert');
const fs = require('fs');

const TASKS = [
	{ filename: "test1.txt", exp1: 1588, exp2: 2188189693529 },
	{ filename: "input.txt" },
];

function polymerization(pairs, rules) {
	const newPairs = new Map();
	pairs.forEach((n, p) => {
		const middle = rules.get(p);
		newPairs.set(p[0] + middle, newPairs.get(p[0] + middle) + n || n);
		newPairs.set(middle + p[1], newPairs.get(middle + p[1]) + n || n);
	});

	return newPairs;
}

function makeHisto(pairs) {
	const histo = new Map();

	pairs.forEach((n, p) => {
		histo.set(p[0], histo.get(p[0]) + n || n);
		histo.set(p[1], histo.get(p[1]) + n || n);
	});

	return histo;
}

function part1(contents) {
	let pairs = new Map();
	for(let i = 0; i < contents[0].length - 1; ++i) {
		const pair = contents[0].slice(i, i + 2);
		pairs.set(pair, pairs.get(pair) + 1 || 1);
	}
	const rules = new Map(contents.slice(2).map(line => line.split(' -> ')));

	for(let i = 0; i < 10; ++i) {
		pairs = polymerization(pairs, rules);
	}

	const h = makeHisto(pairs);
	let m = Number.MAX_SAFE_INTEGER
	let M = Number.MIN_SAFE_INTEGER
	h.forEach((n, _) => {
		m = Math.min(m, Math.round(n / 2));
		M = Math.max(M, Math.round(n / 2));
	});

	return M - m;
}

function part2(contents) {
	let pairs = new Map();
	for(let i = 0; i < contents[0].length - 1; ++i) {
		const pair = contents[0].slice(i, i + 2);
		pairs.set(pair, pairs.get(pair) + 1 || 1);
	}
	const rules = new Map(contents.slice(2).map(line => line.split(' -> ')));

	for(let i = 0; i < 40; ++i) {
		pairs = polymerization(pairs, rules);
	}

	const h = makeHisto(pairs);
	let m = Number.MAX_SAFE_INTEGER
	let M = Number.MIN_SAFE_INTEGER
	h.forEach((n, _) => {
		m = Math.min(m, Math.round(n / 2));
		M = Math.max(M, Math.round(n / 2));
	});

	return M - m;
}

function solveFile({ filename, exp1, exp2, contents }) {
	console.log(`Solving file "${filename}:"`);
	if(contents === undefined) {
		contents = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' }).split('\r\n');
	}

	if(exp1 === undefined && exp2 === undefined) {	// Input file
		const res1 = part1(contents);
		const res2 = part2(contents);

		console.log(`Part 1: ${res1}`);	// 2549
		console.log(`Part 2: ${res2}`);	// 2516901104210
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

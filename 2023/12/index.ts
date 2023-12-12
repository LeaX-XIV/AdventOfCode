// https://adventofcode.com/2023/day/12

import assert = require('assert');
import fs = require('fs');
import { isYieldExpression } from 'typescript';

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
		exp1: 21,
		exp2: 525152,
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

type Springs = string[];

type Arrangements = number[];

type Row = {
	springs: Springs;
	arr: Arrangements;
}

const isRowOk = (row: Row): boolean => {
	let currentGroup = 0;
	let arrangements = [...row.arr];
	for (let i = 0; i < row.springs.length; ++i) {
		if (row.springs[i] === '?')
			return false;

		if (row.springs[i] === '#')
			currentGroup++;
		else if (currentGroup !== 0) {
			if (currentGroup !== arrangements[0])
				return false;

			arrangements = arrangements.slice(1);
			currentGroup = 0;
		} else
			currentGroup = 0;
	}

	return (arrangements.length === 0 && currentGroup === 0) || (arrangements.length === 1 && arrangements[0] === currentGroup);
}

const combinationsR = (collection, combinationLength) => {
	let head, tail, results = [];
	if (combinationLength > collection.length || combinationLength < 1) { return []; }
	if (combinationLength === collection.length) { return [collection]; }
	if (combinationLength === 1) { return collection.map(element => [element]); }
	for (let i = 0; i < collection.length - combinationLength + 1; i++) {
		head = collection.slice(i, i + 1);
		tail = combinationsR(collection.slice(i + 1), combinationLength - 1);
		for (let j = 0; j < tail.length; j++) { results.push(head.concat(tail[j])); /* out of memory */ }
	}
	return results;
}


function* combinations(collection, combinationLength) {
	let head, tail;
	if (combinationLength > collection.length || combinationLength < 1) { yield []; return; }
	if (combinationLength === collection.length) { yield collection; return; }
	if (combinationLength === 1) { for (const element of collection) yield [element]; return; }
	for (let i = 0; i < collection.length - combinationLength + 1; i++) {
		head = collection.slice(i, i + 1);
		tail = combinationsR(collection.slice(i + 1), combinationLength - 1);
		for (let j = 0; j < tail.length; j++) { yield head.concat(tail[j]); }
	}
}

const countDP = (springs: Springs, arrangements: Arrangements, i: number, currentGroup: number): number => {
	if (arrangements.length === 0 && /(\.|\?)*/.test(springs.slice(i).join(""))) // Maximum call stack size exceeded
		return 1;

	if (i >= springs.length && arrangements.length === 1 && arrangements[0] === currentGroup) {
		return 1;
	}
	
	if (currentGroup > arrangements[0]) {
		return 0;
	}

	if (springs[i] === '.') {
		if (currentGroup === arrangements[0]) {
			return countDP(springs, arrangements.slice(1), i + 1, 0);
		} else {
			return countDP(springs, arrangements, i + 1, 0);
		}
	}

	if (springs[i] === '#') {
		return countDP(springs, arrangements, i + 1, currentGroup + 1);
	}

	springs[i] = '#';
	++currentGroup;
	let tot = countDP(springs, arrangements, i + 1, currentGroup); // Maximum call stack size exceeded

	springs[0] = '.';
	tot += countDP(springs, arrangements, i + 1, 0); // Maximum call stack size exceeded

	return tot;
}

const findPossibleArrangements = (row: Row): number => {
	const positions = row.springs
		.map((c, i) => [c, i])
		.filter(([c, i]) => c === '?')
		.map(([c, i]) => i as number);

	let possibleArrangements: number = 0;

	const neededBroken = row.arr.reduce((a, b) => a + b, 0) - row.springs.filter(c => c === '#').length;
	// console.log(neededBroken)

	for (const value of combinations(positions, neededBroken)) {
		// console.log(value)
		for (let i = 0; i < positions.length; ++i) {
			row.springs[positions[i]] = '.';
		}
		for (let i = 0; i < value.length; ++i) {
			row.springs[value[i]] = '#';
		}
		if (isRowOk(row)) {
			// console.log(row.springs.join(""));
			possibleArrangements++;
			// possibleArrangements.push(row.springs);
		}
	}

	return possibleArrangements;
}

const parseRows = (contents: string): Row[] => {
	return contents.split(/\r?\n\r?/)
		.map(line => ({
			springs: line.split(" ")[0].split("").map(c => c),
			arr: line.split(" ")[1].split(",").map(n => Number(n)),
		}));
}

function part1(contents: string): Result {
	const rows = parseRows(contents);

	return rows
		// .map(row => countDP(row.springs, row.arr, 0, 0))
		.map(row => findPossibleArrangements(row))
		.reduce((a, b) => a + b, 0);
}

function part2(contents: string): Result {
	const rows = parseRows(contents);

	return rows
		.map(row => ({
			springs: Array.from(Array(5), _ => row.springs).flatMap(a => [...a, '?']),
			arr: Array.from(Array(5), _ => row.arr).flatMap(a => a),
		}))
		// .map(row => findPossibleArrangements(row))
		.map(row => countDP(row.springs, row.arr, 0, 0))
		.map(n => { console.log(n); return n })
		.reduce((a, b) => a + b, 0);
}

function solveFile({ filename, exp1, exp2, contents }: Task) {
	console.log(`Solving file "${filename}:"`);
	if (contents === undefined) {
		contents = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
	}

	if (exp1 === undefined && exp2 === undefined) {	// Input file
		const res1 = part1(contents!);
		const res2 = part2(contents!);

		console.log(`Part 1: ${res1}`);
		console.log(`Part 2: ${res2}`);
		return;
	}

	if (exp1 !== undefined) {
		const res1 = part1(contents!);
		assert(res1 === exp1, `Expected ${exp1} but found ${res1}`);
		console.log(`Part1: ✅`);
	}
	if (exp2 !== undefined) {
		const res2 = part2(contents!);
		assert(res2 === exp2, `Expected ${exp2} but found ${res2}`);
		console.log(`Part2: ✅`);
	}
}

for (let task of TASKS) {
	solveFile(task);
	console.log();
}

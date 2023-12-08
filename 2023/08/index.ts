// https://adventofcode.com/2023/day/8

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
		exp1: 2,
	},
	{
		filename: "test2.txt",
		exp1: 6,
	},
	{
		filename: "test3.txt",
		exp2: 6,
	},
	{
		filename: "input.txt"
	},
];

type Node = {
	left: string;
	right: string;
}

type Tree = Map<string, Node>;

type Instructions = {
	dirs: string[];
	map: Tree;
}

const parseContents = (contents: string): Instructions => {
	const parts = contents.split(/\r?\n\r?\n\r?/);

	return {
		dirs: parts[0].split(""),
		map: new Map(
			parts[1].split(/\r?\n\r?/)
				.map(line => [ line.substring(0, 3) , { left: line.substring(7, 10), right: line.substring(12, 15) } as Node ])
		)
	} as Instructions;
}

function part1(contents: string): Result {
	let steps = 0;

	const { dirs, map } = parseContents(contents);
	let current = "AAA";

	while (current !== "ZZZ") {
		const split = map.get(current);
		const dir = dirs[steps % dirs.length];

		if (dir === "L") current = split.left;
		else if (dir === "R") current = split.right;

		++steps;
	}

	return steps;
}

function gcd(a: number, b: number): number {
	return !b ? a : gcd(b, a % b);
}

function lcm(a: number, b: number): number {
	return (a * b) / gcd(a, b);
}

function part2(contents: string): Result {
	let steps = 0;

	const { dirs, map } = parseContents(contents);
	let currents = Array.from(map.keys()).filter(pos => pos.endsWith("A"));

	let toEnd = [1];

	while (currents.length) {
		currents = currents
			.filter(current => !current.endsWith("Z"))
			.map(current => {
				const split = map.get(current);
				const dir = dirs[steps % dirs.length];
		
				let newCurrent;
				if (dir === "L") newCurrent = split.left;
				else if (dir === "R") newCurrent = split.right;

				if (newCurrent.endsWith("Z"))
					toEnd.push(steps + 1);

				return newCurrent;
			});
		
		++steps;
	}

	return toEnd.reduce((a, b) => lcm(a, b));
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

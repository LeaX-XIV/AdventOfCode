// https://adventofcode.com/2023/day/1

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
		exp1: 142,
		contents: `1abc2\npqr3stu8vwx\na1b2c3d4e5f\ntreb7uchet`
	},
	{
		filename: "test2.txt",
		exp2: 281,
		contents: `two1nine\neightwothree\nabcone2threexyz\nxtwone3four\n4nineeightseven2\nzoneight234\n7pqrstsixteen`
	},
	{ filename: "input.txt" },
];

const isDigit = (c: string): boolean => {
	return c >= '0' && c <= '9';
}

function part1(contents: string): Result {	
	let sum = 0;
	for (const line of contents.split("\n")) {
		const digits = line.split('').filter(c => isDigit(c));

		const n = Number(digits[0] + digits[digits.length - 1]);
		sum += n;
	}

	return sum;
}

const isDigit2 = (line: string, i: number): string | null => {
	if (isDigit(line[i]))
		return line[i];

	if (line.substring(i).startsWith("one"))
		return "1";
	else if (line.substring(i).startsWith("two"))
		return "2";
	else if (line.substring(i).startsWith("three"))
		return "3";
	else if (line.substring(i).startsWith("four"))
		return "4";
	else if (line.substring(i).startsWith("five"))
		return "5";
	else if (line.substring(i).startsWith("six"))
		return "6";
	else if (line.substring(i).startsWith("seven"))
		return "7";
	else if (line.substring(i).startsWith("eight"))
		return "8";
	else if (line.substring(i).startsWith("nine"))
		return "9";
	else
		return null;
}

function part2(contents: string): Result {
	let sum = 0;
	for (const line of contents.split("\n")) {
		const digits: string[] = line.split('').map((_, i) => isDigit2(line, i)).filter(c => c !== null);

		const n = Number(digits[0] + digits[digits.length - 1]);
		sum += n;
	}

	return sum;
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

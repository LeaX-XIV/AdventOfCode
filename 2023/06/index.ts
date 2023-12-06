// https://adventofcode.com/2023/day/6

import assert = require('assert');
import fs = require('fs');

type Result = number;

type Task = Partial<{
	filename: string;
	exp1: Result;
	exp2: Result;
	contents: string;
}>;

type Race = {
	time: number;
	record: number;
};

const TASKS: Task[] = [
	{
		filename: "test1.txt",
		exp1: 288,
		exp2: 71503,
	},
	{
		filename: "input.txt"
	},
];

const parseRaces = (contents: string): Race[] => {
	const ns: number[][] = contents.split(/\r?\n\r?/)
		.map(line => line.split(":")[1].trim().split(/ +/).map(n => Number(n)));

	const races: Race[] = [];
	for (let i = 0; i < ns[0].length; ++i) {
		races.push({ time: ns[0][i], record: ns[1][i] });
	}

	return races;
}

const countWinConditions = (race: Race): number => {
	let wins = 0;
	for (let timePressing = 1; timePressing < race.time; ++timePressing) {
		const remainingTime = race.time - timePressing;
		const speed = timePressing;

		const distance = speed * remainingTime;

		if (distance > race.record)
			++wins;
	}

	return wins;
}

function part1(contents: string): Result {
	const races = parseRaces(contents);

	return races.map(race => countWinConditions(race)).reduce((a, b) => a * b, 1);
}

function part2(contents: string): Result {
	const race = parseRaces(contents.replaceAll(" ", ""))[0];

	return countWinConditions(race);
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

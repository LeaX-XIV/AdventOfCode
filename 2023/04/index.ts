// https://adventofcode.com/2023/day/4

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
		exp1: 13,
		exp2: 30,
	},
	{
		filename: "input.txt"
	},
];

type Card = {
	winning: number[];
	having: number[];
}

const parseCard = (line: string): Card => {
	return line
		.split(/: +/)[1]
		.split(" | ")
		.map(part =>
			part
				.split(/\W+/)
				.map(n => Number(n))
		)
		.reduce((a, b, i) => {
			switch (i) {
				case 0: return { winning: b };
				case 1: return Object.assign(a, { having: b });
				default: throw new Error()
			}
		}, {}) as Card;
}

function part1(contents: string): Result {
	let tot = 0;

	const cards: Card[] = contents
		.split(/\r?\n\r?/)
		.map(line => parseCard(line));

	for (const card of cards) {
		let matching = 0;

		const nums = new Set(card.winning);
		for (const n of card.having) {
			if (nums.has(n))
				matching++;
		}

		const points = matching > 0 ? 1 << (matching - 1) : 0;
		tot += points;
	}

	return tot;
}

function part2(contents: string): Result {
	const cards: Card[] = contents
		.split(/\r?\n\r?/)
		.map(line => parseCard(line));

	const copies = Array.from(Array(cards.length), _ => 1);
	for (let i = 0; i < cards.length; ++i) {
		const card = cards[i];
		let matching = 0;

		const nums = new Set(card.winning);
		for (const n of card.having) {
			if (nums.has(n))
			matching++;
		}
	
		const copy = copies[i];

		for (let j = 1; j <= matching; ++j) {
			copies[i + j] += copy;
		}
	}

	return copies.reduce((a, b) => a + b, 0);
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

// https://adventofcode.com/2023/day/7

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
		exp1: 6440,
		exp2: 5905,
	},
	{
		filename: "input.txt"
	},
];

type Card = string;

type Hand = Card[];

type HandBid = {
	hand: Hand;
	bid : number;
};

const countOccurrences = (hand: Hand): { [key: Card]: number } => hand.reduce((map, c) => { c in map ? ++map[c] : map[c] = 1; return map; }, {});

const IsFiveOAK = (h :Hand): boolean => Object.values(countOccurrences(h)).some(l => l === 5);
const IsFourOAK = (h :Hand): boolean => Object.values(countOccurrences(h)).some(l => l === 4);
const IsFullHouse = (h :Hand): boolean => IsThreeOAK(h) && IsOnePair(h);
const IsThreeOAK = (h :Hand): boolean => Object.values(countOccurrences(h)).some(l => l === 3);
const IsTwoPair = (h :Hand): boolean => Object.values(countOccurrences(h)).filter(l => l === 2).length === 2;
const IsOnePair = (h :Hand): boolean => Object.values(countOccurrences(h)).filter(l => l === 2).length === 1;
const IsHighCard = (h :Hand): boolean => Object.values(countOccurrences(h)).every(l => l === 1);

const countHandRank = (hand: Hand): number => {
	if (IsFiveOAK(hand))
		return 6;
	else if (IsFourOAK(hand))
		return 5;
	else if (IsFullHouse(hand))
		return 4;
	else if (IsThreeOAK(hand))
		return 3;
	else if (IsTwoPair(hand))
		return 2;
	else if (IsOnePair(hand))
		return 1;
	else if (IsHighCard(hand))
		return 0;
	else
		throw new Error (`Boh ${hand}`);
}

const scoreHand = (h: Hand): number => {
	const CARD_VALUE: Map<Card, number> = new Map([
		["2", 0],
		["3", 1],
		["4", 2],
		["5", 3],
		["6", 4],
		["7", 5],
		["8", 6],
		["9", 7],
		["T", 8],
		["J", 9],
		["Q", 10],
		["K", 11],
		["A", 12],
	]);

	let score = 0;
	for (let i = 0; i < h.length; ++i)
		score += CARD_VALUE.get(h[i]) * CARD_VALUE.size ** (h.length - i - 1);
	score += countHandRank(h) * CARD_VALUE.size ** 5;

	return score;
}

const scoreHand2 = (h: Hand): number => {
	const CARD_VALUE: Map<Card, number> = new Map([
		["J", 0],
		["2", 1],
		["3", 2],
		["4", 3],
		["5", 4],
		["6", 5],
		["7", 6],
		["8", 7],
		["9", 8],
		["T", 9],
		["Q", 10],
		["K", 11],
		["A", 12],
	]);

	let score = 0;
	let i: number;
	for (i = 0; i < h.length; ++i)
		score += CARD_VALUE.get(h[i]) * CARD_VALUE.size ** (h.length - i - 1);

	const cardWithMoreOccurrences: Card =
		Object.entries(
			countOccurrences(h.filter(c => c !== "J"))
		).reduce((a, b) => a[1] > b[1] ? a : b, ["J", 0])[0];

	const normalizedHand: Hand = h.map(c => c === 'J' ? cardWithMoreOccurrences : c);
	score += countHandRank(normalizedHand) * CARD_VALUE.size ** i;

	return score;
}

function part1(contents: string): Result {
	let hands: HandBid[] = contents.split(/\r?\n\r?/)
		.map(line => line
			.split(" ")
			.reduce((o, e, i) => {i === 0 ? o.hand = e.split("") : o.bid = Number(e); return o}, { hand: [], bid: 0 })
		);

	return hands
		.sort((h1, h2) => scoreHand(h1.hand) - scoreHand(h2.hand))
		.map((h, i) => h.bid * (i + 1))
		.reduce((a,b) => a + b, 0);
}

function part2(contents: string): Result {
	let hands: HandBid[] = contents.split(/\r?\n\r?/)
		.map(line => line
			.split(" ")
			.reduce((o, e, i) => {i === 0 ? o.hand = e.split("") : o.bid = Number(e); return o}, { hand: [], bid: 0 })
		);

	return hands
		.sort((h1, h2) => scoreHand2(h1.hand) - scoreHand2(h2.hand))
		.map((h, i) => h.bid * (i + 1))
		.reduce((a,b) => a + b, 0);
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

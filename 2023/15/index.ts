// https://adventofcode.com/2023/day/15

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
		exp1: 52,
		contents: `HASH`
	},
	{
		filename: "test2.txt",
		exp1: 1320,
		exp2: 145,
		contents: `rn=1,cm-,qp=3,cm=2,qp-,pc=4,ot=9,ab=5,pc-,pc=6,ot=7`
	},
	{
		filename: "input.txt"
	},
];

type Lens = {
	label: string,
	focus: number,
};

const HASH = (s: string): number => {
	let curr = 0;
	for (let i = 0; i < s.length; ++i) {
		curr += s.charCodeAt(i);
		curr *= 17;
		curr %= 256;
	}

	return curr;
}

function part1(contents: string): Result {
	return contents.split(",").map(s => HASH(s)).reduce((a, b) => a + b, 0);
}

function part2(contents: string): Result {
	const boxes = new Map<number, Lens[]>();
	for (let i = 0; i < 256; ++i) {
		boxes.set(i, Array(0));
	}

	contents.split(",")
		.forEach(inst => {
			const label = inst.split(/\=|\-/)[0];
			const operation = inst.charAt(inst.indexOf(label) + label.length);
			let focus = undefined;
			if (operation === "=")
				focus = inst.split(/\=|\-/)[1];
			
			const boxId = HASH(label);
		
			const lenses = boxes.get(boxId);
			const remIdx = lenses.findIndex(l => l.label === label);

			if (operation === "-") {
				if (remIdx >= 0)
					lenses.splice(remIdx, 1);
			} else if (operation === "=") {
				if (remIdx >= 0)
					lenses.splice(remIdx, 1, { label, focus });
				else
					lenses.push({ label, focus });
			}

			boxes.set(boxId, lenses);
		});


	return Array.from(boxes.entries()).flatMap(([id, lenses]) =>
		lenses.map(({ focus }, i) => (id + 1) * (i + 1) * focus)
	).reduce((a, b) => a + b, 0);
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

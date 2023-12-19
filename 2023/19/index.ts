// https://adventofcode.com/2023/day/19

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
		exp1: 19114,
		exp2: 167409079868000,
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

type Workflow = Map<string, Rule[]>;

type Rule = {
	condition: string | null;
	next: string;
};

type Part = {
	x: number;
	m: number;
	a: number;
	s: number;
};

const parseContents = (contents: string): { workflows: Workflow, parts: Part[] } => {
	const fields = contents.split(/\r?\n\r?\n\r?/);

	const workflows: Workflow = fields[0].split(/\r?\n\r?/)
		.map(line => {
			const name: string = line.substring(0, line.indexOf('{'));
			const rulesText: string[] = line.substring(line.indexOf('{') + 1, line.indexOf('}')).split(',');

			const rules: Rule[] = rulesText.map(rule => {
				if (rule.indexOf(':') > 0)
					return { condition: rule.split(':')[0], next: rule.split(':')[1] };
				else
					return { condition: null, next: rule };
			});

			return { name, rules };
		})
		.reduce((wf, { name, rules }) => wf.set(name, rules), new Map<string, Rule[]>());

	const parts = fields[1].split(/\r?\n\r?/)
		.map(line => JSON.parse(line
			.replaceAll('=', ':')
			.replaceAll('x', '"x"')
			.replaceAll('m', '"m"')
			.replaceAll('a', '"a"')
			.replaceAll('s', '"s"')
		) as Part);

	return { workflows, parts };
}

const isPartAccepted = (workflows: Workflow, part: Part): boolean => {
	const { x, m, a, s } = part;
	let wf = "in";
	while (true) {
		if (wf === 'A')
			return true;

		if (wf === 'R')
			return false;

		const rules: Rule[] = workflows.get(wf);

		for (const rule of rules) {
			if (rule.condition === null) {
				wf = rule.next;
				break;
			}

			if (eval(rule.condition) === true) {
				wf = rule.next;
				break;
			}
		}
	}
}

function part1(contents: string): Result {
	const { workflows, parts } = parseContents(contents);

	return parts
		.map(part => isPartAccepted(workflows, part) ? part : null)
		.filter(part => part !== null)
		.map(part => part.x + part.m + part.a + part.s)
		.reduce((a, b) => a + b, 0);
}

// AHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAHAH
function part2(contents: string): Result {
	const { workflows } = parseContents(contents);

	let cnt = 0;
	for (let x = 0; x <= 4000; x++)
		for (let m = 0; m <= 4000; m++)
			for (let a = 0; a <= 4000; a++)
				for (let s = 0; s <= 4000; s++)
					if (isPartAccepted(workflows, { x, m, a, s}))
						cnt++;

	return cnt;
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

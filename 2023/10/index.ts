// https://adventofcode.com/2023/day/10

import assert = require('assert');
import fs = require('fs');
import { isObjectBindingPattern } from 'typescript';

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
		exp1: 4,
	},
	{
		filename: "test2.txt",
		exp1: 8,
	},
	// {
	// 	filename: "test3.txt",
	// 	exp2: 4,
	// },
	// {
	// 	filename: "test4.txt",
	// 	exp2: 4,
	// },
	// {
	// 	filename: "test5.txt",
	// 	exp2: 8,
	// },
	{
		filename: "test6.txt",
		exp2: 10,
	},
	{
		filename: "input.txt"
	},
];

type Coords = {
	x: number;
	y: number;
};

type Cell = {
	from: Coords;
	to: Coords;
};

type Map = Cell[][];

const sameCoords = (c1: Coords, c2: Coords): boolean => c1.x === c2.x && c1.y === c2.y;

const addCoords = (c1: Coords, c2: Coords): Coords => ({ x: c1.x + c2.x, y: c1.y + c2.y });

const str = (c: Coords): string => `${c.x}-${c.y}`;

const parseMap = (contents: string): [Map, Coords] => {
	let start: Coords;

	const map: Map = contents.split(/\r?\n\r?/).map((line, y) =>
		line.split("")
			.map((char, x) => {
				switch (char) {
					case ".": return { from: { x,        y        }, to: { x,        y        } } as Cell;
					case "|": return { from: { x,        y: y - 1 }, to: { x,        y: y + 1 } } as Cell;
					case "-": return { from: { x: x - 1, y        }, to: { x: x + 1, y        } } as Cell;
					case "J": return { from: { x,        y: y - 1 }, to: { x: x - 1, y        } } as Cell;
					case "F": return { from: { x,        y: y + 1 }, to: { x: x + 1, y        } } as Cell;
					case "7": return { from: { x,        y: y + 1 }, to: { x: x - 1, y        } } as Cell;
					case "L": return { from: { x,        y: y - 1 }, to: { x: x + 1, y        } } as Cell;
					case "S": start = { x, y };
						      return { from: { x,         y       }, to: { x,        y        } } as Cell;
					default: throw new Error(char);
				}
			})
	);

	let fromStart: Coords, toStart: Coords;
	for (const dxy of [{ x: -1, y: 0}, { x: +1, y: 0}, { x: 0, y: -1}, { x: 0, y: +1}]) {
		const target: Coords = addCoords(start, dxy);
		try {
			if (sameCoords(map[target.y][target.x].from, start) || sameCoords(map[target.y][target.x].to, start)) {
				if (!fromStart) fromStart = { x: target.x, y: target.y };
				else toStart = { x: target.x, y: target.y };
			}
		} catch {}
	}
	map[start.y][start.x] = { from: fromStart, to: toStart };

	return [map, start];
}

function part1(contents: string): Result {
	const [map, startCoords] = parseMap(contents);

	let prev!: Coords;
	let current = startCoords;
	let steps = 0;

	do {
		const currentCell = map[current.y][current.x];
		let next: Coords;
		if (!prev)
			next = currentCell.to;
		else if (sameCoords(currentCell.from, prev))
			next = currentCell.to;
		else if (sameCoords(currentCell.to, prev))
			next = currentCell.from;
		else
			throw new Error("Oops")

		prev = current;
		current = next;

		steps += 1;
	} while(!sameCoords(current, startCoords))

	return Math.ceil(steps / 2);
}

function part2(contents: string): Result {
	const [map, startCoords] = parseMap(contents);

	let prev!: Coords;
	let current = startCoords;
	const cycle = new Map<string, Coords>();

	do {
		const currentCell = map[current.y][current.x];
		let next: Coords;
		if (!prev)
			next = currentCell.to;
		else if (sameCoords(currentCell.from, prev))
			next = currentCell.to;
		else if (sameCoords(currentCell.to, prev))
			next = currentCell.from;
		else
			throw new Error("Oops")

		cycle.set(str(current), current);

		prev = current;
		current = next;

	} while(!sameCoords(current, startCoords))

	const normMap = contents
		.split(/\r?\n\r?/)
		.map((line, y) => line
			.split("")
			.map((c, x) => cycle.has(str({x, y})) ? c === "S" ? "|": c : ".") // Example 3, 4, 5 don't work since S != |
			.join("")
			.replaceAll(/F-*J|L-*7/g, "|")
		);

	let inside = 0;
	for (const line of normMap) {
		let intersections = 0;
		for (const c of line) {
			if (c === "|")
				intersections += 1;

			if (c === "." && intersections % 2 === 1)
				inside += 1;
		}
	}

	return inside;
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

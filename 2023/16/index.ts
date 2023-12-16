// https://adventofcode.com/2023/day/16

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
		exp1: 46,
		exp2: 51,
	},
	{
		filename: "input.txt"
	},
];

type Coords = {
	x: number;
	y: number;
};

const Dir = {
	UP: { x: 0, y: -1 },
	DOWN: { x: 0, y: +1 },
	LEFT: { x: -1, y: 0 },
	RIGHT: { x: +1, y: 0 },
};

type Light = {
	c: Coords;
	d: Coords;
};

type Tile = {
	m: string;
	c: Coords,
	ls: Light[];
};

const parseMap = (contents: string): Tile[][] => {
	return contents.split(/\r?\n\r?/).map((line, y) => line.split("").map((c, x) => ({ m: c, c: { x, y }, ls: [] })));
}

const isSameCoords = (c1: Coords, c2: Coords): boolean => {
	return c1.x === c2.x && c1.y === c2.y;
}

const isSameLight = (l1: Light, l2: Light): boolean => {
	return isSameCoords(l1.c, l2.c) && isSameCoords(l1.d, l2.d);
}

const debugMap = (m: Tile[][]): void => {
	for (let y = 0; y < m.length; ++y) {
		console.log(m[y].map(tile => tile.ls.length > 0 ? "#" : ".").join(""));
	}
}

const energize = (map: Tile[][], source: Light): number => {
	map.forEach(line => line.forEach(tile => tile.ls = []));

	const buf: Light[] = [ source ];

	while(buf.length > 0) {
		const light = buf.shift();

		// Boundary check
		if (light.c.x < 0 || light.c.x >= map[0].length || light.c.y < 0 || light.c.y >= map.length)
			continue;

		// Cycle check
		if (map[light.c.y][light.c.x].ls.some(l => isSameLight(l, light)))
			continue;

		// Save it for next cycle
		map[light.c.y][light.c.x].ls.push(light);

		// Movement
		switch (map[light.c.y][light.c.x].m) {

			case ".":
				buf.push({ c: { x: light.c.x + light.d.x, y: light.c.y + light.d.y }, d: light.d });
				break;

			case "\\": {
				let dir: Coords;
				if (light.d.y === -1) dir = Dir.LEFT;
				else if (light.d.y === +1) dir = Dir.RIGHT;
				else if (light.d.x === -1) dir = Dir.UP;
				else if (light.d.x === +1) dir = Dir.DOWN;
				else throw new Error();

				buf.push({ c: { x: light.c.x + dir.x, y: light.c.y + dir.y }, d: dir });
				break;
			}
			case "/": {
				let dir: Coords;
				if (light.d.y === -1) dir = Dir.RIGHT;
				else if (light.d.y === +1) dir = Dir.LEFT;
				else if (light.d.x === -1) dir = Dir.DOWN;
				else if (light.d.x === +1) dir = Dir.UP;
				else throw new Error();

				buf.push({ c: { x: light.c.x + dir.x, y: light.c.y + dir.y }, d: dir });
				break;
			}
			case "-":
				if (light.d.y === 0)
					buf.push({ c: { x: light.c.x + light.d.x, y: light.c.y + light.d.y }, d: light.d });
				else if (light.d.x === 0) {
					buf.push({ c: { x: light.c.x + Dir.LEFT.x, y: light.c.y + Dir.LEFT.y }, d: Dir.LEFT });
					buf.push({ c: { x: light.c.x + Dir.RIGHT.x, y: light.c.y + Dir.RIGHT.y }, d: Dir.RIGHT });
				}
				else
					throw new Error();
				break;

			case "|":
				if (light.d.x === 0)
					buf.push({ c: { x: light.c.x + light.d.x, y: light.c.y + light.d.y }, d: light.d });
				else if (light.d.y === 0) {
					buf.push({ c: { x: light.c.x + Dir.UP.x, y: light.c.y + Dir.UP.y }, d: Dir.UP });
					buf.push({ c: { x: light.c.x + Dir.DOWN.x, y: light.c.y + Dir.DOWN.y }, d: Dir.DOWN });
				}
				else
					throw new Error();
				break;
		}
	}

	return map.flatMap(line => line.filter(tile => tile.ls.length > 0)).length;
}

function part1(contents: string): Result {
	const map: Tile[][] = parseMap(contents);

	return energize(map, { c: { x: 0, y: 0 }, d: Dir.RIGHT });
}

function part2(contents: string): Result {
	const map: Tile[][] = parseMap(contents);

	const total: number[] = [];

	for (let x = 0; x < map[0].length; ++x) {
		let source: Light = { c: { x, y: 0 }, d: Dir.DOWN };
		total.push(energize(map, source));
		
		source = { c: { x, y: map[0].length - 1 }, d: Dir.UP };
		total.push(energize(map, source));
	}
	for (let y = 0; y < map.length; ++y) {
		let source: Light = { c: { x: 0, y }, d: Dir.RIGHT };
		total.push(energize(map, source));
		
		source = { c: { x: map.length - 1, y }, d: Dir.LEFT };
		total.push(energize(map, source));
	}

	return total.reduce((max, n) => Math.max(max, n), 0);
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

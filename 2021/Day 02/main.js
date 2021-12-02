// https://adventofcode.com/2021/day/2
'use strict';
const assert = require('assert');
const fs = require('fs');

const TASKS = [
	{ filename: "test1.txt", exp1: 150, exp2: 900 },
	{ filename: "input.txt" },
];

class Position {
	constructor() {
		this.x = 0;
		this.y = 0;
	}

	forward(v) {
		this.x += v;
	}

	down(v) {
		this.y += v;
	}

	up(v) {
		this.y -= v;
	}

	followDirections(directions) {
		directions.forEach(mov => {
			const [dir, v] = mov.split(' ');
			assert(v > 0);

			switch(parseDir(dir)) {
				case Direction.FORWARD: this.forward(parseInt(v)); break;
				case Direction.DOWN: this.down(parseInt(v)); break;
				case Direction.UP: this.up(parseInt(v)); break;
				default: throw new TypeError("Unreachable");
			}
		});
	}

	get result() {
		return this.x * this.y;
	}
}

class Submarine extends Position {
	constructor() {
		super();
		this.aim = 0;
	}

	forward(v) {
		super.forward(v);
		this.y += v * this.aim;
	}

	down(v) {
		this.aim += v;
	}

	up(v) {
		this.aim -= v;
	}
}

const Direction = {
	FORWARD: 0,
	DOWN: 1,
	UP: 2
}

function parseDir(d) {
	switch(d) {
		case "forward": return Direction.FORWARD;
		case "down": return Direction.DOWN;
		case "up": return Direction.UP;
		default: throw new TypeError("Unreachable");
	}
}

function part1(contents) {
	const submarine = new Position();
	submarine.followDirections(contents);

	return submarine.result;
}

function part2(contents) {
	const submarine = new Submarine();
	submarine.followDirections(contents);

	return submarine.result;
}

function solveFile({ filename, exp1, exp2, contents }) {
	console.log(`Solving file "${filename}:"`);
	if(contents === undefined) {
		contents = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' }).split('\n');
	}

	if(exp1 === undefined && exp2 === undefined) {	// Input file
		const res1 = part1(contents);
		const res2 = part2(contents);

		console.log(`Part 1: ${res1}`);	// 2150351
		console.log(`Part 2: ${res2}`);	// 1842742223
		return;
	}

	if(exp1 !== undefined) {
		const res1 = part1(contents);
		assert(res1 === exp1, `Expected ${exp1} but found ${res1}`);
		console.log(`Part1: ✅`);
	}
	if(exp2 !== undefined) {
		const res2 = part2(contents);
		assert(res2 === exp2, `Expected ${exp2} but found ${res2}`);
		console.log(`Part2: ✅`);
	}
}

for(let task of TASKS) {
	solveFile(task);
	console.log();
}

// https://adventofcode.com/2021/day/13
'use strict';
const assert = require('assert');
const fs = require('fs');

const TASKS = [
	{ filename: "test1.txt", exp1: 17 },
	{ filename: "input.txt" },
];

function part1(contents) {
	const dots = new Map();
	let firstHalf = true;
	for(const line of contents) {
		if(line.length === 0) {
			firstHalf = false;
			continue;
		}

		if(firstHalf) {
			dots.set(line, true);
		} else {
			let [axis, pos] = line.slice(11).split('=');
			pos = parseInt(pos);
			const fin =
				new Map(Array.from(dots.entries()).map(([coord, _]) => {
					const [x, y] = coord.split(',').map(e => parseInt(e));
					if(axis === 'x') {
						if(x > pos) {
							return [`${pos + pos - x},${y}`, true];
						}
					} else if(axis === 'y') {
						if(y > pos) {
							return [`${x},${pos + pos - y}`, true];
						}
					} else {
						throw new EvalError(`Unreachable: axis = '${axis}'`);
					}
					return [coord, true];
				}))
			return fin.size;
		}
	}

	return 0;
}

function part2(contents) {
	let dots = new Map();
	let firstHalf = true;
	for(const line of contents) {
		if(line.length === 0) {
			firstHalf = false;
			continue;
		}

		if(firstHalf) {
			dots.set(line, true);
		} else {
			let [axis, pos] = line.slice(11).split('=');
			pos = parseInt(pos);
			dots = new Map(Array.from(dots.entries()).map(([coord, _]) => {
				const [x, y] = coord.split(',').map(e => parseInt(e));
				if(axis === 'x') {
					if(x > pos) {
						return [`${pos + pos - x},${y}`, true];
					}
				} else if(axis === 'y') {
					if(y > pos) {
						return [`${x},${pos + pos - y}`, true];
					}
				} else {
					throw new EvalError(`Unreachable: axis = '${axis}'`);
				}
				return [coord, true];
			}));
		}
	}

	let mx = Number.MAX_SAFE_INTEGER
	let Mx = Number.MIN_SAFE_INTEGER
	let my = Number.MAX_SAFE_INTEGER
	let My = Number.MIN_SAFE_INTEGER;
	dots.forEach((_, coord) => {
		const [x, y] = coord.split(',').map(e => parseInt(e));
		mx = Math.min(mx, x);
		Mx = Math.max(Mx, x);
		my = Math.min(my, y);
		My = Math.max(My, y);
	});
	assert(mx === 0 && my === 0, `${mx}, ${my}`);

	const strArr = Array.from({ length: My + 1 }, _ => Array.from({ length: Mx + 1 }, _ => ' '));
	dots.forEach((_, coord) => {
		const [x, y] = coord.split(',').map(e => parseInt(e));
		strArr[y][x] = '█';
	});
	return '\n\n' + strArr.map(l => l.join('')).join('\n');
}

function solveFile({ filename, exp1, exp2, contents }) {
	console.log(`Solving file "${filename}:"`);
	if(contents === undefined) {
		contents = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' }).split('\r\n');
	}

	if(exp1 === undefined && exp2 === undefined) {	// Input file
		const res1 = part1(contents);
		const res2 = part2(contents);

		console.log(`Part 1: ${res1}`);	// 763
		console.log(`Part 2: ${res2}`);	// RHALRCRA
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

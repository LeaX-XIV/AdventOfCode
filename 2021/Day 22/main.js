// https://adventofcode.com/2021/day/22
'use strict';
const assert = require('assert');
const fs = require('fs');

const TASKS = [
	{ filename: "test1.txt", exp1: 39, exp2: 39 },
	{ filename: "test2.txt", exp1: 590784 },
	{ filename: "test3.txt", exp2: 2758514936282235 },
	{ filename: "input.txt" },
];

function constrain(min, val, max) {
	return Math.min(Math.max(min, val), max);
}

function part1(contents) {
	const core = new Map();

	for(const step of contents) {
		const x = constrain(-51, step[1][0], 51);
		const X = constrain(-51, step[1][1], 51);
		const y = constrain(-51, step[2][0], 51);
		const Y = constrain(-51, step[2][1], 51);
		const z = constrain(-51, step[3][0], 51);
		const Z = constrain(-51, step[3][1], 51);

		assert(x <= X, step);
		assert(y <= Y, step);
		assert(z <= Z, step);
		for(let i = x; i <= X; ++i) {
			if(i < -50 || i > 50) continue;
			for(let j = y; j <= Y; ++j) {
				if(j < -50 || j > 50) continue;
				for(let k = z; k <= Z; ++k) {
					if(k < -50 || k > 50) continue;

					if(step[0]) {
						core.set(`${i},${j},${k}`, true);
					} else {
						core.delete(`${i},${j},${k}`);
					}
				}
			}
		}
	}

	return core.size;
}

function countOverlap(el, arr) {
	const [_, [x, X], [y, Y], [z, Z]] = el;
	let volume = (X - x + 1) * (Y - y + 1) * (Z - z + 1);
	let overlappingVolume = 0;
	const overlaps = [];

	for(const i in arr) {
		const [s, [xs, Xs], [ys, Ys], [zs, Zs]] = arr[i];

		assert(xs <= Xs, arr[i]);
		assert(ys <= Ys, arr[i]);
		assert(zs <= Zs, arr[i]);
		if(Xs < x || xs > X || Ys < y || ys > Y || Zs < z || zs > Z) {
			continue;
		}

		const xsl = constrain(x, xs, X);
		const xsh = constrain(x, Xs, X);
		const ysl = constrain(y, ys, Y);
		const ysh = constrain(y, Ys, Y);
		const zsl = constrain(z, zs, Z);
		const zsh = constrain(z, Zs, Z);

		overlaps.push([s, [xsl, xsh], [ysl, ysh], [zsl, zsh]]);
	}

	for(const i in overlaps) {
		overlappingVolume += countOverlap(overlaps[i], overlaps.slice(+i + 1))[1];
	}

	return [overlappingVolume, volume - overlappingVolume];
}

function part2(contents) {
	let onCount = 0;

	for(const i in contents) {
		const cmd = contents[i][0];
		if(!cmd) {
			continue;
		}

		onCount += countOverlap(contents[i], contents.slice(+i + 1))[1];
	}

	return onCount;
}

function solveFile({ filename, exp1, exp2, contents }) {
	console.log(`Solving file "${filename}:"`);
	if(contents === undefined) {
		contents = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' })
			.split('\n')
			.map(l => l
				.trim()
				.split(/ |,/)
				.map((s, i) => {
					if(i === 0) return s === 'on';
					else {
						const first = parseInt(s.slice(2));
						const second = parseInt(s.slice(`${first}`.length + 4));
						return [first, second];
					}
				}));
	}

	if(exp1 === undefined && exp2 === undefined) {	// Input file
		const res1 = part1(contents);
		const res2 = part2(contents);

		console.log(`Part 1: ${res1}`);	// 606484
		console.log(`Part 2: ${res2}`);	// 1162571910364852
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

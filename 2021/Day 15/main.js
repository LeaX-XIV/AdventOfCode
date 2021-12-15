// https://adventofcode.com/2021/day/15
'use strict';
const assert = require('assert');
const fs = require('fs');

const TASKS = [
	{ filename: "test1.txt", exp1: 40, exp2: 315 },
	{ filename: "input.txt" },
];

function contains(a, b) {
	return a.some(x => x.x === b.x && x.y === b.y);
}

const deltas = [
	[1, 0],
	[-1, 0],
	[0, 1],
	[0, -1],
];

function dijkstra(map, x, y) {
	const Q = []; // Should probably use a priority queue ¯\_(ツ)_/¯
	const dist = Array.from({ length: map.length }, _ => Array.from({ length: map[0].length }, _ => Number.MAX_SAFE_INTEGER));
	for(let i = 0; i < map.length; ++i) {
		for(let j = 0; j < map[0].length; ++j) {
			Q.push({ x: j, y: i });
		}
	}
	dist[y][x] = 0;

	while(Q.length > 0) {
		let uidx = 0;
		for(let i = 1; i < Q.length; ++i) {
			if(dist[Q[i].y][Q[i].x] < dist[Q[uidx].y][Q[uidx].x]) {
				uidx = i;
			}
		}

		const u = Q[uidx];
		Q.splice(uidx, 1);
		if(u.x === map[0].length - 1 && u.y === map.length - 1) {
			return dist[u.y][u.x];
		}

		for(const d of deltas) {
			const v = { x: u.x + d[0], y: u.y + d[1] };
			if(contains(Q, v)) {
				const alt = dist[u.y][u.x] + map[v.y][v.x];
				if(alt < dist[v.y][v.x]) {
					dist[v.y][v.x] = alt;
				}
			}
		}
	}

	throw new TypeError("Unreachable");
}

function part1(contents) {
	return dijkstra(contents, 0, 0);
}

function part2(contents) {
	const w = contents[0].length;
	const h = contents.length;
	const bigMap = Array.from({ length: h * 5 }, (_, y) => Array.from({ length: w * 5 }, (_, x) => {
		let c = contents[y % h][x % w] + Math.floor(y / h) + Math.floor(x / w);
		while(c > 9) {
			c = c % 9; + 1
		}
		return c;
	}));

	return dijkstra(bigMap, 0, 0);
}

function solveFile({ filename, exp1, exp2, contents }) {
	console.log(`Solving file "${filename}:"`);
	if(contents === undefined) {
		contents = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' }).split('\r\n').map(line => line.split('').map(e => parseInt(e)));
	}

	if(exp1 === undefined && exp2 === undefined) {	// Input file
		const res1 = part1(contents);
		const res2 = part2(contents);

		console.log(`Part 1: ${res1}`);	// 595
		console.log(`Part 2: ${res2}`);	// 2914
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

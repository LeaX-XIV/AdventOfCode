// https://adventofcode.com/2021/day/20
'use strict';
const assert = require('assert');
const fs = require('fs');

const TASKS = [
	{ filename: "test1.txt", exp1: 35, exp2: 3351 },
	{ filename: "input.txt" },
];

function dumpPhoto(photo, x, y, w, h) {
	const s = [];
	for(let i = y; i < h; ++i) {
		for(let j = x; j < w; ++j) {
			s.push(photo.get(`${j},${i}`) ? '█' : ' ');
		}
		s.push('\n');
	}

	return s.join('');
}

function getEnhanceIndex(map, x, y, mx, my, Mx, My, def) {
	let b = [];
	for(let dy = -1; dy <= 1; ++dy) {
		for(let dx = -1; dx <= 1; ++dx) {
			const [newX, newY] = [x + dx, y + dy];
			if(mx <= newX && newX <= Mx && my <= newY && newY <= My) {
				b.push(map.get(`${newX},${newY}`) ? '1' : '0');
			} else {
				b.push(def ? '1' : '0');
			}
		}
	}

	return parseInt(b.join(''), 2);
}

function part1(contents) {
	const [enhanceStr, map] = contents;
	let infMap = new Map();
	let mx = 0;
	let Mx = map[0].length - 1;
	let my = 0;
	let My = map.length - 1;
	for(let y = 0; y < map.length; ++y) {
		for(let x = 0; x < map[y].length; ++x) {
			if(map[y][x]) {
				infMap.set(`${x},${y}`, true);
			}
		}
	}

	const margin = 1;
	for(let times = 0; times < 2; ++times) {
		mx -= margin;
		Mx += margin;
		my -= margin;
		My += margin;
		const newMap = new Map([]);
		const bgColor = Mx < 50 ? false : enhanceStr[((times + 1) % 2) * (enhanceStr.length - 1)];
		for(let y = my; y <= My; ++y) {
			for(let x = mx; x <= Mx; ++x) {
				let idx = getEnhanceIndex(infMap, x, y, mx + margin, my + margin, Mx - margin, My - margin, bgColor);
				if(enhanceStr[idx]) {
					newMap.set(`${x},${y}`, true);
				}
			}
		}
		infMap = newMap;
	}

	return infMap.size;
}

function part2(contents) {
	const [enhanceStr, map] = contents;
	let infMap = new Map();
	let mx = 0;
	let Mx = map[0].length - 1;
	let my = 0;
	let My = map.length - 1;
	for(let y = 0; y < map.length; ++y) {
		for(let x = 0; x < map[y].length; ++x) {
			if(map[y][x]) {
				infMap.set(`${x},${y}`, true);
			}
		}
	}

	const margin = 1;
	for(let times = 0; times < 50; ++times) {
		mx -= margin;
		Mx += margin;
		my -= margin;
		My += margin;
		const newMap = new Map([]);
		const bgColor = Mx < 90 ? false : enhanceStr[((times + 1) % 2) * (enhanceStr.length - 1)];
		for(let y = my; y <= My; ++y) {
			for(let x = mx; x <= Mx; ++x) {
				let idx = getEnhanceIndex(infMap, x, y, mx + margin, my + margin, Mx - margin, My - margin, bgColor);
				if(enhanceStr[idx]) {
					newMap.set(`${x},${y}`, true);
				}
			}
		}
		infMap = newMap;
	}

	return infMap.size;
}

function solveFile({ filename, exp1, exp2, contents }) {
	console.log(`Solving file "${filename}:"`);
	if(contents === undefined) {
		contents = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' })
			.split('\r\n\r\n')
			.map((l, i) => {
				if(i === 0) return l.split('').map(c => c === '.' ? false : true);
				else return l.split('\r\n').map(a => a.split('').map(p => p === '.' ? false : true));
			});
	}

	if(exp1 === undefined && exp2 === undefined) {	// Input file
		const res1 = part1(contents);
		const res2 = part2(contents);

		console.log(`Part 1: ${res1}`);	// 5461
		console.log(`Part 2: ${res2}`);	// 18226
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

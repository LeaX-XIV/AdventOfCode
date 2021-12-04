// https://adventofcode.com/2021/day/4
'use strict';
const assert = require('assert');
const fs = require('fs');

const TASKS = [
	{ filename: "test1.txt", exp1: 4512, exp2: 1924 },
	{ filename: "input.txt" },
];

function sumOfCovered(board, called) {
	return board
		.flatMap(l => l)
		.filter(n => called.includes(n))
		.reduce((a, b) => a + b, 0);
}

function boardPoints(board, called) {
	for(let row in board) {
		let lineCovered = true;
		for(let col in board[row]) {
			if(!called.includes(board[row][col])) {
				lineCovered = false;
				break;
			}
		}
		if(lineCovered) {
			return board.flatMap(l => l).reduce((a, b) => a + b, 0) - sumOfCovered(board, called);
		}
	}

	for(let col in board) {
		let lineCovered = true;
		for(let row in board[0]) {
			if(!called.includes(board[row][col])) {
				lineCovered = false;
				break;
			}
		}
		if(lineCovered) {
			return board.flatMap(l => l).reduce((a, b) => a + b, 0) - sumOfCovered(board, called);
		}
	}

	return 0;
}

function part1(contents) {
	const called = contents[0].split(',').map(e => parseInt(e));
	const boards = contents
		.slice(1)
		.map(b => b.split('\r\n'))
		.map(l => l.map(e => e
			.trim()
			.split(/ +/i)
			.map(e => parseInt(e))
		));

	let i = 0;
	for(i in called) {
		for(let b of boards) {
			let points = boardPoints(b, called.slice(0, +i + 1));
			if(points > 0) {
				return points * called[+i];
			}
		}
	}

	return 0;
}

function part2(contents) {
	const called = contents[0].split(',').map(e => parseInt(e));
	const boards = contents
		.slice(1)
		.map(b => b.split('\r\n'))
		.map(l => l.map(e => e
			.trim()
			.split(/ +/i)
			.map(e => parseInt(e))
		));

	let i = 0;
	for(i in called) {
		for(let ib = boards.length - 1; ib >= 0; --ib) {
			const b = boards[ib];
			let points = boardPoints(b, called.slice(0, +i + 1));
			if(points > 0) {
				if(boards.length === 1) {
					return points * called[+i];
				}
				boards.splice(ib, 1);
			}
		}
	}

	return 0;
}

function solveFile({ filename, exp1, exp2, contents }) {
	console.log(`Solving file "${filename}:"`);
	if(contents === undefined) {
		contents = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' }).split("\r\n\r\n");
	}

	if(exp1 === undefined && exp2 === undefined) {	// Input file
		const res1 = part1(contents);
		const res2 = part2(contents);

		console.log(`Part 1: ${res1}`);	// 11774
		console.log(`Part 2: ${res2}`);	// 4495
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

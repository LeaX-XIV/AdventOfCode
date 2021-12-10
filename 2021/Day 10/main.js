// https://adventofcode.com/2021/day/10
'use strict';
const assert = require('assert');
const fs = require('fs');

const TASKS = [
	{ filename: "test1.txt", exp1: 26397, exp2: 288957 },
	{ filename: "input.txt" },
];

function isOpening(ch) {
	return ch === '(' || ch === '[' || ch === '{' || ch === '<';
}

function isClosing(ch) {
	return ch === ')' || ch === ']' || ch === '}' || ch === '>';
}

function matching(ch) {
	switch(ch) {
		case '(': return ')';
		case ')': return '(';
		case '[': return ']';
		case ']': return '[';
		case '{': return '}';
		case '}': return '{';
		case '<': return '>';
		case '>': return '<';
		default: throw TypeError(`Unnknown '${ch}'`);
	}
}

function syntaxCheckerScore(illegalCh) {
	switch(illegalCh) {
		case ')': return 3;
		case ']': return 57;
		case '}': return 1197;
		case '>': return 25137;
		default: throw TypeError(`Unnknown '${illegalCh}'`);
	}
}

function autoCompleteScore(autoCompleteCh) {
	switch(autoCompleteCh) {
		case ')': return 1;
		case ']': return 2;
		case '}': return 3;
		case '>': return 4;
		default: throw TypeError(`Unnknown '${autoCompleteCh}'`);
	}
}

function part1(contents) {
	let synErrScore = 0;

	for(const line of contents) {
		const stack = [];
		for(const ch of line) {
			if(isOpening(ch)) {
				stack.push(ch);
			} else if(isClosing(ch)) {
				const openingCh = stack.pop();
				if(openingCh === undefined) SyntaxError("Popping from empty stack");
				if(openingCh === matching(ch)) continue;

				synErrScore += syntaxCheckerScore(ch);
				break;

			} else {
				throw TypeError(`Unnknown '${illegalCh}'`);
			}
		}

		if(stack.length > 0) {
			continue;
		}
	}

	return synErrScore;
}

function part2(contents) {
	let autCompScores = [];

	for(const line of contents) {
		const stack = [];
		for(const ch of line) {
			if(isOpening(ch)) {
				stack.push(ch);
			} else if(isClosing(ch)) {
				const openingCh = stack.pop();
				if(openingCh === undefined) SyntaxError("nnn");
				if(openingCh === matching(ch)) continue;

				stack.splice(0, stack.length);
				break;
			} else {
				throw TypeError(`Unnknown '${illegalCh}'`);
			}
		}

		if(stack.length > 0) {
			let score = 0;
			for(let i = stack.length - 1; i >= 0; --i) {
				const openingCh = stack[i];
				const closingCh = matching(openingCh);

				score = score * 5 + autoCompleteScore(closingCh);
			}
			autCompScores.push(score);
		}
	}

	autCompScores.sort((a, b) => a - b);
	return autCompScores[Math.floor(autCompScores.length / 2)];
}

function solveFile({ filename, exp1, exp2, contents }) {
	console.log(`Solving file "${filename}:"`);
	if(contents === undefined) {
		contents = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' }).split('\r\n');
	}

	if(exp1 === undefined && exp2 === undefined) {	// Input file
		const res1 = part1(contents);
		const res2 = part2(contents);

		console.log(`Part 1: ${res1}`);	// 265527
		console.log(`Part 2: ${res2}`);	// 3963823589
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

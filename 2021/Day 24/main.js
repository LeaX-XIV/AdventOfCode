// https://adventofcode.com/2021/day/24
'use strict';
const assert = require('assert');
const fs = require('fs');

const TASKS = [
	// { filename: "test1.txt", exp1: 0, /* exp2: 0, */ /* contents: "" */ },
	// { filename: "test2.txt", exp1: 0, /* exp2: 0, */ /* contents: "" */ },
	// { filename: "test3.txt", exp1: 0, /* exp2: 0, */ /* contents: "" */ },
	{ filename: "input.txt", /* contents: "" */ },
];

function isNumber(s) {
	return !isNaN(parseInt(s));
}

class ALU {
	constructor() {
		this.regs = {};
		this.reset();
	}

	reset() {
		this.regs['w'] = 0;
		this.regs['x'] = 0;
		this.regs['y'] = 0;
		this.regs['z'] = 0;
	}

	execute(program, inputQ = [1, 1, 1, 1, 1, 1, 1, 1, 1, 1]) {
		for(const [inst, a, b] of program) {
			switch(inst[1]) {
	/* inp*/	case 'n': this.regs[a] = inputQ.shift(); break;
	/* add*/	case 'd': this.regs[a] = this.regs[a] + (isNumber(b) ? parseInt(b) : this.regs[b]); break;
	/* mul*/	case 'u': this.regs[a] = this.regs[a] * (isNumber(b) ? parseInt(b) : this.regs[b]); break;
	/* div*/	case 'i': this.regs[a] = Math.floor(this.regs[a] / (isNumber(b) ? parseInt(b) : this.regs[b])); break;
	/* mod*/	case 'o': this.regs[a] = this.regs[a] % (isNumber(b) ? parseInt(b) : this.regs[b]); break;
	/* eql*/	case 'q': this.regs[a] = (this.regs[a] === (isNumber(b) ? parseInt(b) : this.regs[b])) ? 1 : 0; break;
				default: throw new TypeError(`Unknown instruction ${inst}`);
			}
		}
	}
}

function part1(contents) {
	const alu = new ALU();
	let modelNumber = 100000000000000;
	do {
		--modelNumber;
		const s = modelNumber.toString();
		if(s.split('').some(d => d === '0')) continue;

		console.log(s)
		alu.reset();
		alu.execute(contents, s.split('').map(d => parseInt(d)));
	} while(alu.regs.z !== 0 && modelNumber > 9999999999999);

	console.log(alu)
	return modelNumber;
}

function part2(contents) {
	return 0;
}

function solveFile({ filename, exp1, exp2, contents }) {
	console.log(`Solving file "${filename}:"`);
	if(contents === undefined) {
		contents = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' }).split('\n').map(l => l.trim().split(' '));
	}

	if(exp1 === undefined && exp2 === undefined) {	// Input file
		const res1 = part1(contents);
		const res2 = part2(contents);

		console.log(`Part 1: ${res1}`);
		console.log(`Part 2: ${res2}`);
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

// https://adventofcode.com/2021/day/18
'use strict';
const assert = require('assert');
const fs = require('fs');

const TASKS = [
	// { filename: "firsttest.txt", exp1: 4293, /* exp2: 0, */ /* contents: "" */ },
	// { filename: "test1.txt", exp1: 445, /* exp2: 0, */ /* contents: "" */ },
	// { filename: "test2.txt", exp1: 791, /* exp2: 0, */ /* contents: "" */ },
	// { filename: "test3.txt", exp1: 1137, /* exp2: 0, */ /* contents: "" */ },
	{ filename: "test4.txt", exp1: 3488, /* exp2: 0, */ /* contents: "" */ },
	{ filename: "test5.txt", exp1: 1384, /* exp2: 0, */ /* contents: "" */ },
	{ filename: "test6.txt", exp1: 143, /* exp2: 0, */ /* contents: "" */ },
	{ filename: "test7.txt", exp1: 4140, /* exp2: 0, */ /* contents: "" */ },
	{ filename: "input.txt", /* contents: "" */ },
];

class SFNumber {
	constructor(l, r) {
		this.l = l;
		this.r = r;
	}

	explode(level = 0) {
		if(level >= 4 && typeof (this.l) === 'number' && typeof (this.r) === 'number') {
			return true;
		}

		let ret;
		if(typeof (this.l) === 'object' && typeof (this.l) !== 'number') {
			ret = this.l.explode(level + 1);
			if(typeof (ret) === 'boolean' && ret === true) {
				const toRemove = this.l;
				this.l = 0;
				let right = this.r;
				if(typeof (right) === 'number') { this.r += toRemove.r; }
				else {
					while(typeof (right.l) === 'object') { right = right.l; }
					assert(typeof (right.l) === 'number', `Found ${typeof (right.l)}`);
					right.l += toRemove.r;
					assert(typeof (right.l) === 'number', `Found ${typeof (right.l)}`);
				}

				return [toRemove.l, 0];
			} else if(Array.isArray(ret)) {
				if(ret[0] !== 0 || ret[1] !== 0) {
					if(ret[1] !== 0) {
						let right = this.r;
						if(typeof (right) === 'number') { this.r += ret[1]; }
						else {
							while(typeof (right.l) === 'object') { right = right.l; }
							assert(typeof (right.l) === 'number', `Found ${typeof (right.l)}`);
							right.l += ret[1];
							assert(typeof (right.l) === 'number', `Found ${typeof (right.l)}`);
						}

						// this.l += ret[1];
						return [0, 0];
					}
				}
				return ret;
			}
		}
		if(typeof (this.r) === 'object' && typeof (this.r) !== 'number') {
			ret = this.r.explode(level + 1);
			if(typeof (ret) === 'boolean' && ret === true) {
				const toRemove = this.r;
				this.r = 0;
				let left = this.l;
				if(typeof (left) === 'number') { this.l += toRemove.l; }
				else {
					while(typeof (left.r) === 'object') { left = left.r; }
					assert(typeof (left.r) === 'number', `Found ${typeof (left.r)}`);
					left.r += toRemove.l;
					assert(typeof (left.r) === 'number', `Found ${typeof (left.r)}`);
				}

				return [0, toRemove.r];
			} else if(Array.isArray(ret)) {
				if(ret[0] !== 0 || ret[1] !== 0) {
					if(ret[0] !== 0) {
						let left = this.l;
						if(typeof (left) === 'number') { this.l += ret[0]; }
						else {
							while(typeof (left.r) === 'object') { left = left.r; }
							assert(typeof (left.r) === 'number', `Found ${typeof (left.r)}`);
							left.r += ret[0];
							assert(typeof (left.r) === 'number', `Found ${typeof (left.r)}`);
						}
						// this.r += ret[0];
						return [0, 0];
					}
				}
				return ret;
			}
		}

		return false;
	}

	split() {
		if(typeof (this.l) === 'number' && this.l >= 10) {
			this.l = new SFNumber(Math.floor(this.l / 2), Math.ceil(this.l / 2));
			return true;
		}
		if(typeof (this.r) === 'number' && this.r >= 10) {
			this.r = new SFNumber(Math.floor(this.r / 2), Math.ceil(this.r / 2));
			return true;
		}

		let ret;
		if(typeof (this.l) === 'object') {
			ret = this.l.split();
			if(ret === true) {
				return true;
			}
		}
		if(typeof (this.r) === 'object') {
			ret = this.r.split();
			if(ret === true) {
				return true;
			}
		}

		return false;
	}

	reduce() {
		let done = true;
		while(done) {
			done = false;
			while(this.explode()) { done = true; }
			if(this.split()) { done = true; }
		}
		return this;
	}

	magnitude() {
		const magL = 3 * (typeof (this.l) === 'number' ? this.l : this.l.magnitude());
		const magR = 2 * (typeof (this.r) === 'number' ? this.r : this.r.magnitude());

		return magL + magR;
	}

	toString() {
		return `[${this.l.toString()},${this.r.toString()}]`;
	}

	static add(a, b) {
		return new SFNumber(a, b).reduce();
	}

	static fromArray(a) {
		if(Array.isArray(a)) {
			return new SFNumber(SFNumber.fromArray(a[0]), SFNumber.fromArray(a[1]));
		} else {
			return a;
		}
	}
}

function part1(contents) {
	let sum = SFNumber.fromArray(JSON.parse(contents[0]));

	for(let i = 1; i < contents.length; ++i) {
		const b = SFNumber.fromArray(JSON.parse(contents[i]));
		sum = SFNumber.add(sum, b);
	}

	console.log(sum.toString());
	return sum.magnitude();
}

function part2(contents) {
	return 0;
}

function solveFile({ filename, exp1, exp2, contents }) {
	console.log(`Solving file "${filename}:"`);
	if(contents === undefined) {
		contents = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' }).split('\r\n');
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

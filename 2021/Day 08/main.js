// https://adventofcode.com/2021/day/8
'use strict';
const assert = require('assert');
const fs = require('fs');

const TASKS = [
	{ filename: "test1.txt", exp1: 0, exp2: 5353 },
	{ filename: "test2.txt", exp1: 26, exp2: 61229 },
	{ filename: "input.txt" },
];

const segments = [
	/* 0 */ "abcefg",
	/* 1 */ "cf",
	/* 2 */ "acdeg",
	/* 3 */ "acdfg",
	/* 4 */ "bcdf",
	/* 5 */ "abdfg",
	/* 6 */ "abdefg",
	/* 7 */ "acf",
	/* 8 */ "abcdefg",
	/* 9 */ "abcdfg",
];

function diff(a, b) {
	return a.split('').filter(x => b.indexOf(x) < 0).join('');
}

function intersect(a, b) {
	return a.split('').filter(x => b.indexOf(x) >= 0).join('');
}

function contains(a, b) {
	return b.split('').every(x => a.indexOf(x) >= 0);
}

function part1(contents) {
	return contents
		.map(s => s.split('|')[1].split(' '))
		.map(a => a.filter(s => s.length === 2 || s.length === 4 || s.length === 3 || s.length === 7))
		.flatMap(a => a.length)
		.reduce((a, b) => a + b);
}

function part2(contents) {
	let sum = 0;
	for(const line of contents) {
		const [input, output] = line.split(' | ');
		const ss = input.split(' ');
		const outs = output.split(' ');
		let lineOut = 0;
		const pred = {
			'a': "abcdefg".split(''),
			'b': "abcdefg".split(''),
			'c': "abcdefg".split(''),
			'd': "abcdefg".split(''),
			'e': "abcdefg".split(''),
			'f': "abcdefg".split(''),
			'g': "abcdefg".split(''),
		};

		const one = ss.filter(s => s.length === 2)[0];
		pred['c'] = one.split('');
		pred['f'] = one.split('');
		const seven = ss.filter(s => s.length === 3)[0];
		pred['a'] = diff(seven, one);
		const four = ss.filter(s => s.length === 4)[0];
		pred['b'] = diff(four, one).split('');
		const eight = ss.filter(s => s.length === 7)[0];
		const six = ss.filter(s => s.length === 6 && diff(s, one).length === 5)[0];
		pred['f'] = intersect(one, six);
		pred['c'] = diff(one, six);
		const zero = ss.filter(s => s.length === 6 && contains(s, one) && diff(four, s).length === 1)[0];
		pred['d'] = diff(four, zero);
		pred['b'] = diff(pred['b'].join(''), pred['d']);
		const three = ss.filter(s => s.length === 5 && contains(s, [pred['a'], pred['c'], pred['d'], pred['f']].join('')))[0];
		pred['g'] = diff(three, [pred['a'], pred['c'], pred['d'], pred['f']].join(''));
		const nine = ss.filter(s => s.length === 6 && contains(s, one) && contains(s, [pred['a'], pred['b'], pred['c'], pred['d'], pred['f'], pred['g']].join('')))[0];
		pred['e'] = diff(eight, nine);

		for(const idx in pred) {
			const p = pred[idx];
			assert(p.length === 1, `Predicted '${idx}' = ${p}`);
		}

		for(const idx in outs) {
			const out = outs[idx];
			const digit = segments.filter(seg =>
				seg.length === out.length &&
				seg === out
					.split('')
					.map(c => {
						for(const i in pred)
							if(pred[i] === c) {
								return i;
							}
					})
					.sort()
					.join('')
			)
				.map(seg => {
					for(const i in segments)
						if(segments[i] === seg) {
							return i;
						}
				})[0];

			lineOut += digit * 10 ** (3 - idx);
		}
		sum += lineOut;
	}

	return sum;
}

function solveFile({ filename, exp1, exp2, contents }) {
	console.log(`Solving file "${filename}:"`);
	if(contents === undefined) {
		contents = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' }).split("\r\n");
	}

	if(exp1 === undefined && exp2 === undefined) {	// Input file
		const res1 = part1(contents);
		const res2 = part2(contents);

		console.log(`Part 1: ${res1}`); // 470
		console.log(`Part 2: ${res2}`); // 989396
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

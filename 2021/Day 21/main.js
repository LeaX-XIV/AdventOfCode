// https://adventofcode.com/2021/day/21
'use strict';
const assert = require('assert');
const fs = require('fs');

const TASKS = [
	{ filename: "test1.txt", exp1: 739785, exp2: 444356092776315, /* contents: "" */ },
	// { filename: "test2.txt", exp1: 0, /* exp2: 0, */ /* contents: "" */ },
	// { filename: "test3.txt", exp1: 0, /* exp2: 0, */ /* contents: "" */ },
	{ filename: "input.txt", /* contents: "" */ },
];

function rollDie3(central) {
	if(central === 100) {
		return [200, 3];
	}

	if(central === 1) {
		return [103, 4];
	}

	return [central * 3, (central + 3) % 100];
}

function part1(contents) {
	let dieCenter = 2;
	let turns = 0;
	let scores = [0, 0];
	let pos = [...contents];

	while(scores[0] < 1000 && scores[1] < 1000) {
		const [currRoll, nextDieCenter] = rollDie3(dieCenter);
		const player = turns % 2;
		pos[player] = (pos[player] + currRoll) % 10;
		scores[player] += pos[player] === 0 ? 10 : pos[player];

		dieCenter = nextDieCenter;
		++turns;
	}

	return 3 * turns * Math.min(...scores);
}

function part2(contents) {
	const wins = [0, 0];
	const states = [{ pos: [...contents], scores: [0, 0], n: 1 }];

	while(states.length > 0) {
		const { pos, scores, n } = states.pop();

		for(let d1 = 1; d1 <= 3; ++d1) {
			for(let d2 = 1; d2 <= 3; ++d2) {
				for(let d3 = 1; d3 <= 3; ++d3) {

					let uPos1 = pos[0];
					let uScore1 = scores[0];

					uPos1 = (uPos1 + d1 + d2 + d3) % 10;
					uScore1 += uPos1 === 0 ? 10 : uPos1;

					if(uScore1 >= 21) {
						wins[0] += n;
					} else {
						for(let dd1 = 1; dd1 <= 3; ++dd1) {
							for(let dd2 = 1; dd2 <= 3; ++dd2) {
								for(let dd3 = 1; dd3 <= 3; ++dd3) {

									let uPos2 = pos[1];
									let uScore2 = scores[1];


									uPos2 = (uPos2 + dd1 + dd2 + dd3) % 10;
									uScore2 += uPos2 === 0 ? 10 : uPos2;

									if(uScore2 >= 21) {
										wins[1] += n;
									} else {
										const stateIdx = states.findIndex(s =>
											s.pos[0] === uPos1 &&
											s.pos[1] === uPos2 &&
											s.scores[0] === uScore1 &&
											s.scores[1] === uScore2
										);

										if(stateIdx >= 0) {
											states[stateIdx].n += n;
										} else {
											states.push({ pos: [uPos1, uPos2], scores: [uScore1, uScore2], n });
										}
									}
								}
							}
						}
					}
				}
			}
		}
	}

	return Math.max(...wins);
}

function solveFile({ filename, exp1, exp2, contents }) {
	console.log(`Solving file "${filename}:"`);
	if(contents === undefined) {
		contents = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' }).split('\r\n').map(l => parseInt(l.slice(-2)));
	}

	if(exp1 === undefined && exp2 === undefined) {	// Input file
		const res1 = part1(contents);
		const res2 = part2(contents);

		console.log(`Part 1: ${res1}`);	// 1002474
		console.log(`Part 2: ${res2}`);	// 919758187195363
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

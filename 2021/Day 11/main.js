// https://adventofcode.com/2021/day/11
'use strict';
const assert = require('assert');
const fs = require('fs');
const { exec } = require("child_process");
const { argv } = require('process');

const TASKS = [
	{ filename: "test1.txt", exp1: 1656, exp2: 195 },
	{ filename: "input.txt" },
];

function dump(grid) {
	for(let y = 0; y < grid.length; ++y) {
		console.log(grid[y].join(''));
	}
	console.log('');
}

function coordEq(a, b) {
	return a.x === b.x && a.y === b.y;
}

function incrementAll(grid) {
	return grid.map(l => l.map(o => o + 1));;
}

function whichFlash(grid, flashedBefore) {
	const flashed = [];

	for(let y = 0; y < grid.length; ++y) {
		for(let x = 0; x < grid[0].length; ++x) {
			if(grid[y][x] > 9 &&
				!flashedBefore.some(a => coordEq(a, { x, y })) &&
				!flashed.some(a => coordEq(a, { x, y }))) {

				flashed.push({ x, y });
			}
		}
	}

	return flashed;
}

function doFlash(grid, x, y) {
	for(let dy = -1; dy <= 1; ++dy) {
		for(let dx = -1; dx <= 1; ++dx) {
			if(dy === dx && dy === 0) continue;
			if(0 <= y + dy && y + dy < grid.length && 0 <= x + dx && x + dx < grid[0].length) {
				grid[y + dy][x + dx] += 1;
			}
		}
	}
}

function part1(contents) {
	let flashCount = 0;

	for(let step = 0; step < 100; ++step) {
		const flashed = [];
		contents = incrementAll(contents);

		let newFlashed = whichFlash(contents, flashed);
		while(newFlashed.length > 0) {
			newFlashed.forEach(coords => {
				doFlash(contents, coords.x, coords.y);
				flashed.push(coords);
				flashCount += 1;
			});
			newFlashed = whichFlash(contents, flashed);
		}

		flashed.forEach(coords => contents[coords.y][coords.x] = 0);
	}

	return flashCount;
}

function part2(contents) {
	let step;
	for(step = 0; true; ++step) {
		const flashed = [];
		contents = incrementAll(contents);

		let newFlashed = whichFlash(contents, flashed);
		while(newFlashed.length > 0) {
			newFlashed.forEach(coords => {
				doFlash(contents, coords.x, coords.y);
				flashed.push(coords);
			});
			newFlashed = whichFlash(contents, flashed);
		}


		if(flashed.length === contents.length * contents[0].length) {
			break;
		}

		flashed.forEach(coords => contents[coords.y][coords.x] = 0);
	}

	return step + 1;
}

function visualization(contents) {
	function toFixedLength(str, length) {
		let build = '';
		for(let i = 0; i < length - str.length; ++i) build += '0';
		build += str;

		return build;
	}
	function saveFrame(step, grid) {
		fs.writeFile(
			`frames/frame${toFixedLength('' + step, 3)}.pbm`,
			"P2\n10 10\n100\n" + grid.map(l => l.map(o => Math.min(o, 10)).map(o => o < 10 ? '' + o : o * o).join(' ')).join('\n'),
			{},
			err => { if(err) console.log(err) }
		);
	}

	let step;
	let loops = 0;
	for(step = 0; true; ++step) {
		const flashed = [];
		contents = incrementAll(contents);

		let newFlashed = whichFlash(contents, flashed);
		while(newFlashed.length > 0) {
			newFlashed.forEach(coords => {
				doFlash(contents, coords.x, coords.y);
				flashed.push(coords);
			});
			newFlashed = whichFlash(contents, flashed);
		}

		saveFrame(step, contents);

		if(flashed.length === contents.length * contents[0].length) {
			if(loops < 10) {
				loops += 1;
			} else break;
		}

		flashed.forEach(coords => contents[coords.y][coords.x] = 0);

	}

	exec("ffmpeg -y -framerate 20 -i frames/frame%3d.pbm -vf scale=320:240 visualization.gif", (error, stdout, stderr) => {
		if(error) {
			console.log(`error: ${error.message}`);
			return;
		}
		if(stderr) {
			console.log(`stderr: ${stderr}`);
			return;
		}
		console.log(`stdout: ${stdout}`);
	});
}

function solveFile({ filename, exp1, exp2, contents }) {
	console.log(`Solving file "${filename}:"`);
	if(contents === undefined) {
		contents = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' }).split('\r\n').map(l => l.split('').map(e => parseInt(e)));
	}

	if(exp1 === undefined && exp2 === undefined) {	// Input file
		const res1 = part1(contents);
		const res2 = part2(contents);

		console.log(`Part 1: ${res1}`);	// 1679
		console.log(`Part 2: ${res2}`);	// 519

		// argv.forEach((a, i) => console.log(a, i))
		if(argv[2] === '-visual') {
			console.log("Generating visualization");
			visualization(contents);
		}
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

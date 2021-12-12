// https://adventofcode.com/2021/day/12
'use strict';
const assert = require('assert');
const fs = require('fs');

const TASKS = [
	{ filename: "test1.txt", exp1: 10, exp2: 36 },
	{ filename: "test2.txt", exp1: 19 },
	{ filename: "test3.txt", exp1: 226 },
	{ filename: "input.txt" },
];

function isUpperCase(str) {
	return str === str.toUpperCase();
}

function isLowerCase(str) {
	return str === str.toLowerCase();
}

class Cave {
	constructor(name) {
		this.name = name;
		this.visited = 0;
		this.neighs = [];
	}

	hasName(n) { return this.name === n; }

	visit() { this.visited++; }
	canBeVisited() { return this.isBig ? true : this.visited === 0; }
	canBeVisited2() { return this.isBig ? true : this.visited <= 1; }
	unvisit() { this.visited--; }

	addNeigh(neigh) { if(!this.isNeigh(neigh.name)) this.neighs.push(neigh); }
	isNeigh(n) { return this.neighs.some(neigh => neigh.hasName(n)); }

	get isBig() { return isUpperCase(this.name); }
	get isSmall() { return isLowerCase(this.name); }
}

function constructGraph(topology) {
	const nodes = [];
	for(const line of topology) {
		const [n1, n2] = line;
		let node1 = nodes.find(node => node.hasName(n1));
		let node2 = nodes.find(node => node.hasName(n2));

		if(node1 === undefined) {
			node1 = new Cave(n1);
			nodes.push(node1);
		}
		if(node2 === undefined) {
			node2 = new Cave(n2);
			nodes.push(node2);
		}
		node1.addNeigh(node2);
		node2.addNeigh(node1);
	}

	return nodes.find(node => node.hasName('start'));
}

function navigateToEnd(start) {
	if(start.hasName('end')) {
		return 1;
	}

	let numPaths = 0;
	for(const neigh of start.neighs) {
		if(neigh.canBeVisited()) {
			neigh.visit();
			numPaths += navigateToEnd(neigh);
			neigh.unvisit();
		}
	}

	return numPaths;
}

function navigateToEnd2(start, canDoublePass) {
	if(start.hasName('end')) {
		return 1;
	}

	let numPaths = 0;
	for(const neigh of start.neighs) {
		if(neigh.canBeVisited()) {
			neigh.visit();
			numPaths += navigateToEnd2(neigh, canDoublePass);
			neigh.unvisit();
		} else if(neigh.isSmall && neigh.canBeVisited2() && canDoublePass) {
			neigh.visit();
			numPaths += navigateToEnd2(neigh, false);
			neigh.unvisit();
		}
	}

	return numPaths;
}

function part1(contents) {
	const startNode = constructGraph(contents);
	startNode.visit();
	const numPaths = navigateToEnd(startNode);

	return numPaths;
}

function part2(contents) {
	const startNode = constructGraph(contents);
	startNode.visit();
	startNode.visit();
	const numPaths = navigateToEnd2(startNode, true);

	return numPaths;
}

function solveFile({ filename, exp1, exp2, contents }) {
	console.log(`Solving file "${filename}:"`);
	if(contents === undefined) {
		contents = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' }).split('\r\n').map(l => l.split('-'));
	}

	if(exp1 === undefined && exp2 === undefined) {	// Input file
		const res1 = part1(contents);
		const res2 = part2(contents);

		console.log(`Part 1: ${res1}`);	// 3000
		console.log(`Part 2: ${res2}`);	// 74222
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

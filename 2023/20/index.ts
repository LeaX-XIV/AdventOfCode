// https://adventofcode.com/2023/day/20

import assert = require('assert');
import fs = require('fs');

type Result = number;

type Task = Partial<{
	filename: string;
	exp1: Result;
	exp2: Result;
	contents: string;
}>;

const TASKS: Task[] = [
	{
		filename: "test1.txt",
		exp1: 32000000,
		// exp2: 0,
		// contents: ``
	},
	{
		filename: "test2.txt",
		exp1: 11687500,
		// exp2: 0,
		// contents: ``
	},
	// {
	// 	filename: "test3.txt",
	// 	// exp1: 0,
	// 	// exp2: 0,
	// 	// contents: ``
	// },
	{
		filename: "input.txt"
		// contents: ``
	},
];

class Module {
	name: string;
	outputs: Module[];

	constructor(name: string) {
		this.name = name;
		this.outputs = [];
	}

	inputSignal(s: Signal): void { }

	outputPulse(p: Pulse): void {
		for (const out of this.outputs) {
			const signalToSend: Signal = { pulse: p, from: this, to: out };
			enqueueSignal(signalToSend);
		}
	}
}

class FlipFlop extends Module {
	state: Pulse;

	constructor(name: string) {
		super(name);
		this.state = Pulse.LOW;
	}

	override inputSignal(s: Signal): void {
		const p = s.pulse;
		if (p === Pulse.LOW) {
			this.state = this.state === Pulse.LOW ? Pulse.HIGH : Pulse.LOW;
			this.outputPulse(this.state);
		}
	}
}

class Conjunction extends Module {
	states: Map<string, Pulse>;

	constructor(name: string) {
		super(name);
		this.states = new Map<string, Pulse>();
	}

	addInput(m: Module): void {
		this.states.set(m.name, Pulse.LOW);
	}

	override inputSignal(s: Signal): void {
		this.states.set(s.from.name, s.pulse);
		const pulseToSend = Array.from(this.states.values()).every(p => p === Pulse.HIGH) ? Pulse.LOW : Pulse.HIGH;
		this.outputPulse(pulseToSend);
	}
}

class Broadcaster extends Module {
	constructor() {
		super("broadcaster");
	}

	override inputSignal(s: Signal): void {
		this.outputPulse(s.pulse);
	}
}

const enum Pulse {
	LOW = 0,
	HIGH = 1,
}

type Signal = {
	pulse: Pulse;
	from: Module;
	to: Module;
};

let lowPulses = 0;
let highPulses = 0;
let signalBuffer: Signal[] = [];

const enqueueSignal = (s: Signal): void => {
	if (s.pulse === Pulse.LOW)
		++lowPulses;
	else if (s.pulse === Pulse.HIGH)
		++highPulses;

	signalBuffer.push(s);
}

const parseContents = (contents: string): Broadcaster => {
	const lines = contents.split(/\r?\n\r?/);
	let b: Broadcaster = null;

	const modules = new Map<string, Module>();

	lines.forEach(line => {
		if (line.startsWith('%')) {
			// flipflop
			const name = line.split(' -> ')[0].substring(1);
			modules.set(name, new FlipFlop(name));
		} else if (line.startsWith('&')) {
			// conjunctor
			const name = line.split(' -> ')[0].substring(1);
			modules.set(name, new Conjunction(name));
		} else {
			// Broadcast
			b = new Broadcaster();
			modules.set('broadcaster', b);
		}
	});

	lines.forEach(line => {
		line = line.replace(/^%|&/, '');

		const parts: string[] = line.split(' -> ');
		const module: Module = modules.get(parts[0]);

		const names: string[] = parts[1].split(', ');
		names.forEach(name => {
			let outModule: Module = modules.get(name);
			if (typeof outModule === 'undefined') {
				outModule = new Module(name);
				modules.set(name, outModule);
			}

			module.outputs.push(outModule);

			if (outModule instanceof Conjunction)
				outModule.addInput(module);
		});
	});

	return b;
}

function part1(contents: string): Result {
	lowPulses = 0;
	highPulses = 0;
	signalBuffer = [];

	const broadcaster = parseContents(contents);

	const pushButton = () => enqueueSignal({ pulse: Pulse.LOW, from: null, to: broadcaster });

	for (let i = 0; i < 1000; ++i) {
		pushButton();
		while (signalBuffer.length > 0) {
			const signal: Signal = signalBuffer.shift();
			signal.to.inputSignal(signal);
		}
	}

	return lowPulses * highPulses;
}

function part2(contents: string): Result {
	lowPulses = 0;
	highPulses = 0;
	signalBuffer = [];

	const broadcaster = parseContents(contents);

	const pushButton = () => enqueueSignal({ pulse: Pulse.LOW, from: null, to: broadcaster });

	for (let i = 1; ; ++i) {
		pushButton();
		while (signalBuffer.length > 0) {
			const signal: Signal = signalBuffer.shift();
			if (signal.to.name === 'rx' && signal.pulse === Pulse.LOW)
				return i;
			signal.to?.inputSignal(signal);
		}
	}
}

function solveFile({ filename, exp1, exp2, contents }: Task) {
	console.log(`Solving file "${filename}:"`);
	if(contents === undefined) {
		contents = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
	}

	if(exp1 === undefined && exp2 === undefined) {	// Input file
		const res1 = part1(contents!);
		const res2 = part2(contents!);

		console.log(`Part 1: ${res1}`);
		console.log(`Part 2: ${res2}`);
		return;
	}

	if(exp1 !== undefined) {
		const res1 = part1(contents!);
		assert(res1 === exp1, `Expected ${exp1} but found ${res1}`);
		console.log(`Part1: ✅`);
	}
	if(exp2 !== undefined) {
		const res2 = part2(contents!);
		assert(res2 === exp2, `Expected ${exp2} but found ${res2}`);
		console.log(`Part2: ✅`);
	}
}

for(let task of TASKS) {
	solveFile(task);
	console.log();
}

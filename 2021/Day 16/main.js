// https://adventofcode.com/2021/day/16
'use strict';
const assert = require('assert');
const fs = require('fs');

const TASKS = [
	{ filename: "test 1", exp1: 6, exp2: 2021, contents: "D2FE28" },
	{ filename: "test 2", exp1: 9, exp2: 1, contents: "38006F45291200" },
	{ filename: "test 3", exp1: 14, exp2: 3, contents: "EE00D40C823060" },
	{ filename: "test 4", exp1: 16, contents: "8A004A801A8002F478" },
	{ filename: "test 5", exp1: 12, contents: "620080001611562C8802118E34" },
	{ filename: "test 6", exp1: 23, contents: "C0015000016115A2E0802F182340" },
	{ filename: "test 7", exp1: 31, contents: "A0016C880162017C3686B18A3D4780" },
	{ filename: "test 8", exp2: 3, contents: "C200B40A82" },
	{ filename: "test 9", exp2: 54, contents: "04005AC33890" },
	{ filename: "test 10", exp2: 7, contents: "880086C3E88112" },
	{ filename: "test 11", exp2: 9, contents: "CE00C43D881120" },
	{ filename: "test 12", exp2: 1, contents: "D8005AC2A8F0" },
	{ filename: "test 13", exp2: 0, contents: "F600BC2D8F" },
	{ filename: "test 14", exp2: 0, contents: "9C005AC2F8F0" },
	{ filename: "test 15", exp2: 1, contents: "9C0141080250320F1802104A08" },
	{ filename: "input.txt" },
];

class Packet {
	constructor(version, type, value = undefined) {
		this.version = version;
		this.type = type;
		this.value = value
		this.sub = [];
	}

	addSubPacket(sp) {
		this.sub.push(sp);
	}
}

function fromHexToBinArray(hex) {
	return Array.from({ length: hex.length * 4 }, (_, i) => ((parseInt(hex[Math.floor(i / 4)], 16) >> (3 - (i % 4))) & 1) == 1);
}

function fromBinSliceToDec(arr, s, l) {
	assert(l > 0 && s + l <= arr.length);

	let par = 0;
	for(let i = 0; i < l; ++i) {
		par = (par * 2) + arr[s + i];
	}

	return par;
}

function decodePacket(arr, i) {
	while(i + 6 < arr.length) {
		const ver = fromBinSliceToDec(arr, i, 3);
		i += 3;
		const typ = fromBinSliceToDec(arr, i, 3);
		i += 3;

		if(typ === 4) {	// Literal
			let val = 0;
			let cont = 0;
			do {
				const group = fromBinSliceToDec(arr, i, 5);
				i += 5;

				cont = (group >> 4) & 1;
				const v = group & 0xF;
				val = (val * 16) + v;
			} while(cont === 1);

			return [new Packet(ver, typ, val), i];
		} else {	// Subpacket
			const extPack = new Packet(ver, typ);
			const lenId = fromBinSliceToDec(arr, i, 1);
			i += 1;
			if(lenId === 0) {
				const len = fromBinSliceToDec(arr, i, 15);
				i += 15;
				let subLength = 0;
				while(subLength < len) {
					const [subP, newI] = decodePacket(arr, i);
					extPack.addSubPacket(subP);
					subLength += newI - i;
					i = newI;
				}
			} else {
				const len = fromBinSliceToDec(arr, i, 11);
				i += 11;
				for(let j = 0; j < len; ++j) {
					const [subP, newI] = decodePacket(arr, i);
					extPack.addSubPacket(subP);
					i = newI;
				}
			}
			return [extPack, i];
		}
	}
}

function sumVersion(packet) {
	let partial = packet.version;

	for(const sub of packet.sub) {
		partial += sumVersion(sub);
	}

	return partial;
}

function packetEval(packet) {
	switch(packet.type) {
		case 0: return packet.sub.map(p => packetEval(p)).reduce((a, b) => a + b, 0);
		case 1: return packet.sub.map(p => packetEval(p)).reduce((a, b) => a * b, 1);
		case 2: return packet.sub.map(p => packetEval(p)).reduce((a, b) => a < b ? a : b, Number.MAX_SAFE_INTEGER);
		case 3: return packet.sub.map(p => packetEval(p)).reduce((a, b) => a > b ? a : b, Number.MIN_SAFE_INTEGER);
		case 4: return packet.value;
		case 5: return packetEval(packet.sub[0]) > packetEval(packet.sub[1]) ? 1 : 0;
		case 6: return packetEval(packet.sub[0]) < packetEval(packet.sub[1]) ? 1 : 0;
		case 7: return packetEval(packet.sub[0]) === packetEval(packet.sub[1]) ? 1 : 0;
		default: throw new TypeError("Unreachable");
	}
}

function part1(contents) {
	const arr = fromHexToBinArray(contents);
	let i = 0;
	const [headPacket, _] = decodePacket(arr, i);

	return sumVersion(headPacket);
}

function part2(contents) {
	const arr = fromHexToBinArray(contents);
	let i = 0;
	const [headPacket, _] = decodePacket(arr, i);

	return packetEval(headPacket);
}

function solveFile({ filename, exp1, exp2, contents }) {
	console.log(`Solving file "${filename}:"`);
	if(contents === undefined) {
		contents = fs.readFileSync(filename, { encoding: 'utf8', flag: 'r' });
	}

	if(exp1 === undefined && exp2 === undefined) {	// Input file
		const res1 = part1(contents);
		const res2 = part2(contents);

		console.log(`Part 1: ${res1}`);	// 1012
		console.log(`Part 2: ${res2}`);	// 2223947372407
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

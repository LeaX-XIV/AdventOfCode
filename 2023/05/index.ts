// https://adventofcode.com/2023/day/5

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
		exp1: 35,
		exp2: 46,
	},
	{
		filename: "input.txt"
	},
];

type Range = {
	source: number;
	n: number
};

type RangeMap = {
	source: number;
	dest: number;
	n: number;
}

class Almanac {
	seeds: number[];
	seed2soil: RangeMap[];
	soil2fertilizer: RangeMap[];
	fertilizer2water: RangeMap[];
	water2light: RangeMap[];
	light2temperature: RangeMap[];
	temperature2humidity: RangeMap[];
	humidity2location: RangeMap[];
	
	constructor(contents: string) {
		this.seeds = [];
		this.seed2soil = [];
		this.soil2fertilizer = [];
		this.fertilizer2water = [];
		this.water2light = [];
		this.light2temperature = [];
		this.temperature2humidity = [];
		this.humidity2location = [];

		const sections = contents.split(/\r?\n\r?\n\r?/);

		// seeds
		this.seeds = sections[0]
			.substring("seeds: ".length)
			.split(" ")
			.map(n => Number(n));

		// seed-to-soil
		sections[1].substring(sections[1].indexOf("\n") + 1)
			.split(/\r?\n\r?/)
			.map(line => line.split(" ").map(n => Number(n)))
			.map(ranges => ({ source: ranges[1], dest: ranges[0], n: ranges[2] }))
			.sort((a, b) => a.source - b.source)
			.forEach(range => this.seed2soil.push(range));

		// soil-yo-fertilizer
		sections[2].substring(sections[2].indexOf("\n") + 1)
			.split(/\r?\n\r?/)
			.map(line => line.split(" ").map(n => Number(n)))
			.map(ranges => ({ source: ranges[1], dest: ranges[0], n: ranges[2] }))
			.sort((a, b) => a.source - b.source)
			.forEach(range => this.soil2fertilizer.push(range));

		// fertilizer-to-water
		sections[3].substring(sections[3].indexOf("\n") + 1)
			.split(/\r?\n\r?/)
			.map(line => line.split(" ").map(n => Number(n)))
			.map(ranges => ({ source: ranges[1], dest: ranges[0], n: ranges[2] }))
			.sort((a, b) => a.source - b.source)
			.forEach(range => this.fertilizer2water.push(range));

		// water-to-light
		sections[4].substring(sections[4].indexOf("\n") + 1)
			.split(/\r?\n\r?/)
			.map(line => line.split(" ").map(n => Number(n)))
			.map(ranges => ({ source: ranges[1], dest: ranges[0], n: ranges[2] }))
			.sort((a, b) => a.source - b.source)
			.forEach(range => this.water2light.push(range));

		// light-to-temperature
		sections[5].substring(sections[5].indexOf("\n") + 1)
			.split(/\r?\n\r?/)
			.map(line => line.split(" ").map(n => Number(n)))
			.map(ranges => ({ source: ranges[1], dest: ranges[0], n: ranges[2] }))
			.sort((a, b) => a.source - b.source)
			.forEach(range => this.light2temperature.push(range));

		// temperature-to-humidity
		sections[6].substring(sections[6].indexOf("\n") + 1)
			.split(/\r?\n\r?/)
			.map(line => line.split(" ").map(n => Number(n)))
			.map(ranges => ({ source: ranges[1], dest: ranges[0], n: ranges[2] }))
			.sort((a, b) => a.source - b.source)
			.forEach(range => this.temperature2humidity.push(range));

		// humidity-to-location
		sections[7].substring(sections[7].indexOf("\n") + 1)
			.split(/\r?\n\r?/)
			.map(line => line.split(" ").map(n => Number(n)))
			.map(ranges => ({ source: ranges[1], dest: ranges[0], n: ranges[2] }))
			.sort((a, b) => a.source - b.source)
			.forEach(range => this.humidity2location.push(range));
	}

	applyRangeMap(inRange: Range, map: RangeMap[]): Range[] {
		const outRanges = [];
		const currentRange = inRange;

		for (let i = 0; i < map.length && currentRange.n > 0; ++i) {
			const range = map[i];
			
			const currentEnd = currentRange.source + currentRange.n - 1;
			const rangeEnd = range.source + range.n - 1;

			if (range.source <= currentRange.source && range.source + range.n - 1 >= currentRange.source) {
				const intersectionSource = Math.max(currentRange.source, range.source);
				const intersectionEnd = Math.min(currentEnd, rangeEnd);
				const intersection = { source: intersectionSource, n: intersectionEnd - intersectionSource + 1 };

				outRanges.push({ source: range.dest + (currentRange.source - range.source), n: intersection.n });
				currentRange.source = intersection.source + intersection.n;
				currentRange.n -= intersection.n;
			}
		}

		if (currentRange.n > 0)
			outRanges.push(currentRange);

		return outRanges;
	}

	soils(seeds: Range): Range[] {
		return this.applyRangeMap(seeds, this.seed2soil);
	}

	fertilizers(soils: Range): Range[] {
		return this.applyRangeMap(soils, this.soil2fertilizer);
	}

	waters(fertilizers: Range): Range[] {
		return this.applyRangeMap(fertilizers, this.fertilizer2water);
	}

	lights(waters: Range): Range[] {
		return this.applyRangeMap(waters, this.water2light);
	}

	temperatures(lights: Range): Range[] {
		return this.applyRangeMap(lights, this.light2temperature);
	}

	humidities(temperatures: Range): Range[] {
		return this.applyRangeMap(temperatures, this.temperature2humidity);
	}

	locations(humidities: Range): Range[] {
		return this.applyRangeMap(humidities, this.humidity2location);
	}

	seedsLocations(seeds: Range[]): Range[] {
		return seeds
			.flatMap(seedRange => this.soils(seedRange))
			.flatMap(soilRange => this.fertilizers(soilRange))
			.flatMap(fertilizerRange => this.waters(fertilizerRange))
			.flatMap(waterRange => this.lights(waterRange))
			.flatMap(lightRange => this.temperatures(lightRange))
			.flatMap(temperatureRange => this.humidities(temperatureRange))
			.flatMap(humidityRange => this.locations(humidityRange));
	}
}

function part1(contents: string): Result {
	const almanac = new Almanac(contents);

	return almanac.seeds
		.map(s => ({ source: s, n: 1 }))
		.flatMap(s => almanac.seedsLocations([s]))
		.map(range => range.source)
		.reduce((a, b) => a < b ? a : b, Infinity);
}

function part2(contents: string): Result {
	const almanac = new Almanac(contents);

	const seedRanges = almanac.seeds.reduce((result, value, index, array) => {
		if (index % 2 === 0)
		  result.push({ source: array[index], n: array[index + 1]});
		return result;
	  }, [] as Range[]);

	return almanac
		.seedsLocations(seedRanges)
		.map((locationRange: Range) => locationRange.source)
		.reduce((a, b) => a > b ? b : a, Infinity);
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

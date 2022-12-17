// https://adventofcode.com/2022/day/15
package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"strings"
)

type Part1Type int
type Part2Type int
type InputType struct {
	sensor, beacon Position
}

type Position struct {
	x, y int
}

type Task struct {
	filename     string
	expected1    Part1Type
	expected2    Part2Type
	isTest       bool
	line, maxIdx int
}

var tasks = []Task{
	{filename: "test1.txt", expected1: 26, expected2: 56000011, isTest: true, line: 10, maxIdx: 20},
	{filename: "input.txt", line: 2000000, maxIdx: 4000000},
}

func mapInputLine(line string) (InputType, error) {
	var res InputType

	fmt.Sscanf(line, "Sensor at x=%d, y=%d: closest beacon is at x=%d, y=%d", &res.sensor.x, &res.sensor.y, &res.beacon.x, &res.beacon.y)

	return res, nil
}

func prepareInput(filename string) ([]InputType, error) {
	bs, err := ioutil.ReadFile(filename)
	if err != nil {
		return nil, err
	}
	contents := string(bs)
	contents = strings.Replace(contents, "\r", "", -1)
	lines := strings.FieldsFunc(contents, func(c rune) bool { return c == '\n' })
	var input = make([]InputType, len(lines))

	for i, s := range lines {
		mappedLine, err := mapInputLine(s)
		if err != nil {
			return nil, err
		}
		input[i] = mappedLine
	}

	return input, nil
}

func abs(x int) int {
	if x < 0 {
		return -x
	}
	return x
}

func clamp(v, min, max int) int {
	if v < min {
		return min
	}
	if v > max {
		return max
	}

	return v
}

func part1(input []InputType, line int) (result Part1Type) {
	notBeaconOnLine := make(map[int]struct{})

	for _, read := range input {
		dist := abs(read.sensor.x-read.beacon.x) + abs(read.sensor.y-read.beacon.y)
		lineDist := abs(line - read.sensor.y)
		if lineDist <= dist {
			for x := read.sensor.x - dist + lineDist; x <= read.sensor.x+dist-lineDist; x++ {
				notBeaconOnLine[x] = struct{}{}
			}
		}
		if read.beacon.y == line {
			delete(notBeaconOnLine, read.beacon.x)
		}
	}

	result = Part1Type(len(notBeaconOnLine))

	return
}

func part2(input []InputType, res1 Part1Type, maxIdx int) (result Part2Type) {
	borders := make(map[Position]struct{})
	// Add outer layer border to border
	for _, read := range input {
		dist := abs(read.sensor.x-read.beacon.x) + abs(read.sensor.y-read.beacon.y)
		for i := 0; i < dist+1; i++ {
			border := []Position{
				{read.sensor.x + i, read.sensor.y + dist + 1 - i},
				{read.sensor.x + i, read.sensor.y - dist - 1 + i},
				{read.sensor.x + dist + 1 - i, read.sensor.y + i},
				{read.sensor.x - dist - 1 + i, read.sensor.y + i},
			}
			for _, b := range border {
				if b.x >= 0 && b.x < maxIdx && b.y >= 0 && b.y < maxIdx {
					borders[b] = struct{}{}
				}
			}
		}
	}

	// Remove border points closer than current beacon
	for _, read := range input {
		dist := abs(read.sensor.x-read.beacon.x) + abs(read.sensor.y-read.beacon.y)
		for pos := range borders {
			borderDist := abs(read.sensor.x-pos.x) + abs(read.sensor.y-pos.y)
			if borderDist <= dist {
				delete(borders, pos)
			}
		}
	}

	if len(borders) != 1 {
		fmt.Println(borders, len(borders))
		panic("Not possible")
	}
	for pos := range borders {
		result = Part2Type(pos.x*4000000 + pos.y)
	}

	return
}

func solveProblem(task Task, runP1 bool) {
	var (
		filename  = task.filename
		expected1 = task.expected1
		expected2 = task.expected2
		doAssert  = task.isTest
		line      = task.line
		maxIdx    = task.maxIdx
		actual1   Part1Type
		actual2   Part2Type
	)

	input, err := prepareInput(filename)
	if err != nil {
		fmt.Println(filename, "❌", "Error reading file", err)
		return
	} else {
		fmt.Println(filename)
	}

	fmt.Print("Part 1 ")
	actual1 = part1(input, line)
	if doAssert && expected1 != actual1 {
		fmt.Println("❌", "Expected:", expected1, "Actual", actual1)
	} else {
		fmt.Println("✅", actual1)
	}
	if !runP1 {
		fmt.Print("Part 2 ")
		actual2 = part2(input, actual1, maxIdx)
		if doAssert && expected2 != actual2 {
			fmt.Println("❌", "Expected:", expected2, "Actual", actual2)
		} else {
			fmt.Println("✅", actual2)
		}
	}
}

func main() {
	runP1 := flag.Bool("1", false, "Run part 1")
	runTests := flag.Bool("tests", false, "Run test cases")
	flag.Parse()

	for _, t := range tasks {
		if !*runTests && t.isTest {
			// Don't run test cases
			continue
		}
		solveProblem(t, *runP1)
	}
}

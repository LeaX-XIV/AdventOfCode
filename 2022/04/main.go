// https://adventofcode.com/2022/day/4
package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"strconv"
	"strings"
)

type Part1Type int
type Part2Type int
type InputType [2]struct {
	start, end int
}

type Task struct {
	filename  string
	expected1 Part1Type
	expected2 Part2Type
	isTest    bool
}

var tasks = []Task{
	{filename: "test1.txt", expected1: 2, expected2: 4, isTest: true},
	{filename: "input.txt"},
}

func mapInputLine(line string) (InputType, error) {
	var res InputType

	fields := strings.Split(line, ",")
	for i, s := range fields {
		edges := strings.Split(s, "-")
		tmp, err := strconv.Atoi(edges[0])
		if err != nil {
			break
		}
		res[i].start = tmp
		tmp, err = strconv.Atoi(edges[1])
		if err != nil {
			break
		}
		res[i].end = tmp
	}

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

func totalOverlap(aStart, aEnd, bStart, bEnd int) bool {
	return (aStart >= bStart && aEnd <= bEnd) ||
		(bStart >= aStart && bEnd <= aEnd)
}

func overlap(aStart, aEnd, bStart, bEnd int) bool {
	return aStart <= bEnd && aEnd >= bStart
}

func part1(input []InputType) (result Part1Type) {
	nTotalOverlaps := 0

	for _, v := range input {
		aStart, aEnd, bStart, bEnd := v[0].start, v[0].end, v[1].start, v[1].end
		if totalOverlap(aStart, aEnd, bStart, bEnd) {
			nTotalOverlaps++
		}
	}

	result = Part1Type(nTotalOverlaps)

	return
}

func part2(input []InputType, res1 Part1Type) (result Part2Type) {
	nOverlaps := 0

	for _, v := range input {
		aStart, aEnd, bStart, bEnd := v[0].start, v[0].end, v[1].start, v[1].end
		if overlap(aStart, aEnd, bStart, bEnd) {
			nOverlaps++
		}
	}

	result = Part2Type(nOverlaps)

	return
}

func solveProblem(task Task, runP1 bool) {
	var (
		filename  = task.filename
		expected1 = task.expected1
		expected2 = task.expected2
		doAssert  = task.isTest
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
	actual1 = part1(input)
	if doAssert && expected1 != actual1 {
		fmt.Println("❌", "Expected:", expected1, "Actual", actual1)
	} else {
		fmt.Println("✅", actual1)
	}
	if !runP1 {
		fmt.Print("Part 2 ")
		actual2 = part2(input, actual1)
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

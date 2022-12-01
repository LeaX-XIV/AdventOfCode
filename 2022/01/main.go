// https://adventofcode.com/2022/day/1
package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"strings"
	"strconv"
)

type Part1Type int
type Part2Type int
type InputType []int

type Task struct {
	filename  string
	expected1 Part1Type
	expected2 Part2Type
	isTest    bool
}

var tasks = []Task{
	{filename: "test1.txt", expected1: 24000, expected2: 45000, isTest: true},
	{filename: "input.txt"},
}

func mapInputLine(line string) (InputType, error) {
	var res InputType

	for _, n := range strings.Split(line, " ") {
		num, err := strconv.Atoi(n)
		if err != nil {
			return res, err
		}
		res = append(res, num)
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
	contents = strings.Replace(contents, "\n", " ", -1)
	contents = strings.Replace(contents, "  ", "\n", -1)
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

func part1(input []InputType) (result Part1Type) {
	maxCals := 0
	for _, cals := range input {
		sum := 0
		for _, c := range cals {
			sum += c
		}
		if sum > maxCals {
			maxCals = sum
		}
	}

	result = Part1Type(maxCals)

	return
}

func part2(input []InputType, res1 Part1Type) (result Part2Type) {
	maxCals := make([]int, 3)
	for _, cals := range input {
		sum := 0
		for _, c := range cals {
			sum += c
		}
		if sum > maxCals[0] {
			maxCals[0], maxCals[1], maxCals[2] = sum, maxCals[0], maxCals[1]
		} else if sum > maxCals[1] {
			maxCals[1], maxCals[2] = sum, maxCals[1]
		} else if sum > maxCals[2] {
			maxCals[2] = sum
		}
	}

	result = Part2Type(maxCals[0] + maxCals[1] + maxCals[2])

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
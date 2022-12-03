// https://adventofcode.com/2022/day/3
package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"strings"
)

type Part1Type int
type Part2Type int
type InputType string

type Task struct {
	filename  string
	expected1 Part1Type
	expected2 Part2Type
	isTest    bool
}

var tasks = []Task{
	{filename: "test1.txt", expected1: 157, expected2: 70, isTest: true},
	{filename: "input.txt"},
}

func mapInputLine(line string) (InputType, error) {
	var res InputType

	res = InputType(line)

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

func getPriority(c rune) int {
	if int(c) <= 'Z' {
		return int(c) - int('A') + 27
	}
	return int(c) - int('a') + 1
}

func part1(input []InputType) (result Part1Type) {
	sum := 0
	for _, rucksack := range input {
		a, b := string(rucksack)[:len(rucksack) / 2], string(rucksack)[len(rucksack) / 2:]
		for _, c := range a {
			if strings.ContainsRune(b, c) {
				sum += getPriority(c)
				break
			}
		}
	}

	result = Part1Type(sum)

	return
}

func part2(input []InputType, res1 Part1Type) (result Part2Type) {
	sum := 0
	for i := 0; i < len(input); i += 3 {
		group := input[i:i+3]
		for _, c := range group[i%3] {
			if strings.ContainsRune(string(group[1]), c) && strings.ContainsRune(string(group[2]), c) {
				sum += getPriority(c)
				break
			}
		}
	}

	result = Part2Type(sum)

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
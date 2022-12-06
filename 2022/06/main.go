// https://adventofcode.com/2022/day/6
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
	{filename: "test1.txt", expected1: 7, expected2: 19, isTest: true},
	{filename: "test2.txt", expected1: 5, expected2: 23, isTest: true},
	{filename: "test3.txt", expected1: 6, expected2: 23, isTest: true},
	{filename: "test4.txt", expected1: 10, expected2: 29, isTest: true},
	{filename: "test5.txt", expected1: 11, expected2: 26, isTest: true},
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

func getIndexAfterNEquals(packet string, n int) int {
	for i := 0; i < len(packet) - n; i++ {
		m := make(map[rune]int)
		for _, r := range packet[i:i+n] {
			m[r] = 1
		}
		if len(m) == n {
			return i + n
		}
	}

	return -1
}

func part1(input []InputType) (result Part1Type) {
	i := getIndexAfterNEquals(string(input[0]), 4)

	result = Part1Type(i)

	return
}

func part2(input []InputType, res1 Part1Type) (result Part2Type) {
	i := getIndexAfterNEquals(string(input[0]), 14)

	result = Part2Type(i)

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
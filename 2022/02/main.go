// https://adventofcode.com/2022/day/2
package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"strings"
)

type Part1Type int
type Part2Type int
type Move int
type InputType struct {
	a, b Move
}

const (
	rock Move = iota
	paper
	scissors
)

type Task struct {
	filename  string
	expected1 Part1Type
	expected2 Part2Type
	isTest    bool
}

var tasks = []Task{
	{filename: "test1.txt", expected1: 15, expected2: 12, isTest: true},
	{filename: "input.txt"},
}

func mapInputLine(line string) (InputType, error) {
	var res InputType

	fields := strings.Fields(line)
	switch fields[0] {
	case "A": res.a = rock
	case "B": res.a = paper
	case "C": res.a = scissors
	}
	switch fields[1] {
	case "X": res.b = rock
	case "Y": res.b = paper
	case "Z": res.b = scissors
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

func getScore(a, b Move) int {
	if a == b {
		// Tie
		return 3 + int(b) + 1
	} else if (a + 1) % 3 == b {
		// Win
		return 6 + int(b) + 1
	}
	// Loss
	return 0 + int(b) + 1
}

func part1(input []InputType) (result Part1Type) {
	points := 0
	for _, round := range input {
		points += getScore(round.a, round.b)
	}

	result = Part1Type(points)

	return
}

func part2(input []InputType, res1 Part1Type) (result Part2Type) {
	points := 0
	for _, round := range input {
		switch round.b {
		case rock: round.b = (round.a + 2) % 3
		case paper:  round.b = round.a
		case scissors: round.b = (round.a + 1) % 3
		}
		points += getScore(round.a, round.b)
	}

	result = Part2Type(points)

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
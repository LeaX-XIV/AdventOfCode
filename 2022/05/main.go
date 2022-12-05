// https://adventofcode.com/2022/day/5
package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"strings"
)

type Part1Type string
type Part2Type string
type InputType struct {
	crates      [9][]string
	n, from, to int
}

type Task struct {
	filename  string
	expected1 Part1Type
	expected2 Part2Type
	isTest    bool
}

var tasks = []Task{
	{filename: "test1.txt", expected1: "CMZ", expected2: "MCD", isTest: true},
	{filename: "input.txt"},
}

func mapInputLine(line string) (InputType, error) {
	var res InputType

	fmt.Sscanf(line, "move %d from %d to %d", &res.n, &res.from, &res.to)

	return res, nil
}

func prepareInput(filename string) ([]InputType, error) {
	bs, err := ioutil.ReadFile(filename)
	if err != nil {
		return nil, err
	}
	contents := string(bs)
	contents = strings.Replace(contents, "\r", "", -1)
	parts := strings.Split(contents, "\n\n")[:2]
	crates, moves := parts[0], parts[1]

	crateLines := strings.FieldsFunc(crates, func(c rune) bool { return c == '\n' })
	lines := strings.FieldsFunc(moves, func(c rune) bool { return c == '\n' })
	var input = make([]InputType, len(lines)+1)
	for i := range input[0].crates {
		input[0].crates[i] = make([]string, 0)
	}
	var nCrates int
	l := len(crateLines)
	fmt.Sscanf(crateLines[l-1][len(crateLines[l-1])-4:], "%d", &nCrates)

	for i := 0; i < len(crateLines)-1; i++ {
		line := crateLines[i]
		for j := 0; j < nCrates; j++ {
			crate := strings.Trim(line[j*4:j*4+2], " ")
			if len(crate) == 0 {
				continue
			}
			input[0].crates[j] = append(input[0].crates[j], crate[1:2])
		}
	}

	for i, s := range lines {
		mappedLine, err := mapInputLine(s)
		if err != nil {
			return nil, err
		}
		input[i+1] = mappedLine
	}

	return input, nil
}

func part1(input []InputType) (result Part1Type) {
	crates := input[0].crates

	for i := 1; i < len(input); i++ {
		n, from, to := input[i].n, input[i].from, input[i].to

		tmp := make([]string, 0)
		for i := n - 1; i >= 0; i-- {
			tmp = append(tmp, crates[from-1][i])
		}
		for _, s := range crates[to-1] {
			tmp = append(tmp, s)
		}
		crates[to-1] = tmp
		crates[from-1] = crates[from-1][n:]
	}

	resStr := ""
	for _, v := range crates {
		if len(v) > 0 {
			resStr += v[0]
		}
	}

	result = Part1Type(resStr)

	return
}

func part2(input []InputType, res1 Part1Type) (result Part2Type) {
	crates := input[0].crates

	for i := 1; i < len(input); i++ {
		n, from, to := input[i].n, input[i].from, input[i].to

		tmp := make([]string, 0)
		for i := 0; i < n; i++ {
			tmp = append(tmp, crates[from-1][i])
		}
		for _, s := range crates[to-1] {
			tmp = append(tmp, s)
		}
		crates[to-1] = tmp
		crates[from-1] = crates[from-1][n:]
	}

	resStr := ""
	for _, v := range crates {
		if len(v) > 0 {
			resStr += v[0]
		}
	}

	result = Part2Type(resStr)

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

// https://adventofcode.com/2022/day/20
package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"strconv"
	"strings"
)

type Part1Type int64
type Part2Type int64
type InputType int
type Item struct {
	i, n int
}

type Task struct {
	filename  string
	expected1 Part1Type
	expected2 Part2Type
	isTest    bool
}

var tasks = []Task{
	{filename: "test1.txt", expected1: 3, expected2: 1623178306, isTest: true},
	{filename: "input.txt"},
}

func mapInputLine(line string) (InputType, error) {
	var res InputType

	num, err := strconv.Atoi(line)
	if err != nil {
		return 0, err
	}
	res = InputType(num)

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

func indexOf(a []Item, n Item) int {
	for i := 0; i < len(a); i++ {
		if a[i] == n {
			return i
		}
	}

	panic("Not found")
}

func indexOfN(a []Item, n int) int {
	for i := 0; i < len(a); i++ {
		if a[i].n == n {
			return i
		}
	}

	panic("Not found")
}

func part1(input []InputType) (result Part1Type) {
	file := make([]Item, len(input))
	for i, e := range input {
		file[i] = Item{i: i, n: int(e)}
	}

	for inputIndex := range input {
		n := int(input[inputIndex])
		item := Item{i: inputIndex, n: n}
		i := indexOf(file, item)
		file = append(file[:i], file[i+1:]...)
		insertIndex := (int(i) + n) % len(file)
		if insertIndex < 0 {
			insertIndex += len(file)
		}
		file = append(file, Item{})
		copy(file[insertIndex+1:], file[insertIndex:])
		file[insertIndex] = item
	}

	zeroIdx := indexOfN(file, 0)
	result = Part1Type(
		file[(zeroIdx+1000)%len(file)].n +
			file[(zeroIdx+2000)%len(file)].n +
			file[(zeroIdx+3000)%len(file)].n)

	return
}

func part2(input []InputType, res1 Part1Type) (result Part2Type) {
	dKey := 811589153
	file := make([]Item, len(input))
	for i, e := range input {
		file[i] = Item{i: i, n: int(e)}
	}

	for l := 0; l < 10; l++ {
		for inputIndex := range input {
			n := int(input[inputIndex])
			item := Item{i: inputIndex, n: n}
			i := indexOf(file, item)
			file = append(file[:i], file[i+1:]...)
			insertIndex := (i + n*dKey) % len(file)
			if insertIndex < 0 {
				insertIndex += len(file)
			}
			file = append(file, Item{})
			copy(file[insertIndex+1:], file[insertIndex:])
			file[insertIndex] = item
		}
	}

	zeroIdx := indexOfN(file, 0)
	result = Part2Type(
		file[(zeroIdx+1000)%len(file)].n*dKey +
			file[(zeroIdx+2000)%len(file)].n*dKey +
			file[(zeroIdx+3000)%len(file)].n*dKey)

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

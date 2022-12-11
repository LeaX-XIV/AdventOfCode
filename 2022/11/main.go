// https://adventofcode.com/2022/day/11
package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"sort"
	"strings"
)

type Part1Type int
type Part2Type int
type InputType struct {
	items                               []int
	operands                            [2]int // old as -1
	operation                           rune
	divisibilityTest                    int
	divisibilityTrue, divisibilityFalse int
}

type Task struct {
	filename  string
	expected1 Part1Type
	expected2 Part2Type
	isTest    bool
}

var tasks = []Task{
	{filename: "test1.txt", expected1: 10605, expected2: 2713310158, isTest: true},
	{filename: "input.txt"},
}

func mapInputLine(monkey string) (InputType, error) {
	var res InputType

	var operandsStr [2]string
	lines := strings.Split(monkey, "\n")
	startItemsStr := strings.Split(lines[1][18:], ", ")
	for _, item := range startItemsStr {
		var newItem int
		fmt.Sscanf(item, "%d", &newItem)
		res.items = append(res.items, newItem)
	}

	fmt.Sscanf(lines[2][19:], "%s %c %s", &operandsStr[0], &res.operation, &operandsStr[1])
	if operandsStr[0] == "old" {
		res.operands[0] = -1
	} else {
		fmt.Sscanf(operandsStr[0], "%d", &res.operands[0])
	}
	if operandsStr[1] == "old" {
		res.operands[1] = -1
	} else {
		fmt.Sscanf(operandsStr[1], "%d", &res.operands[1])
	}

	fmt.Sscanf(lines[3][21:], "%d", &res.divisibilityTest)
	fmt.Sscanf(lines[4][29:], "%d", &res.divisibilityTrue)
	fmt.Sscanf(lines[5][30:], "%d", &res.divisibilityFalse)

	return res, nil
}

func prepareInput(filename string) ([]InputType, error) {
	bs, err := ioutil.ReadFile(filename)
	if err != nil {
		return nil, err
	}
	contents := string(bs)
	contents = strings.Replace(contents, "\r", "", -1)
	monkeys := strings.Split(contents, "\n\n")
	var input = make([]InputType, len(monkeys))

	for i, s := range monkeys {
		mappedLine, err := mapInputLine(s)
		if err != nil {
			return nil, err
		}
		input[i] = mappedLine
	}

	return input, nil
}

func getWorry(item int, operands [2]int, operation rune) int {
	var op1, op2 int
	op1 = operands[0]
	if op1 < 0 {
		op1 = item
	}

	op2 = operands[1]
	if op2 < 0 {
		op2 = item
	}

	switch operation {
	case '+':
		return op1 + op2
	case '*':
		return op1 * op2
	}

	panic("Why are we here?")
}

func part1(input []InputType) (result Part1Type) {
	inspected := make([]int, len(input))
	monkeys := make([]InputType, len(input))
	for monkeyId := 0; monkeyId < len(monkeys); monkeyId++ {
		monkeys[monkeyId].items = make([]int, 0)
		for _, v := range input[monkeyId].items {
			monkeys[monkeyId].items = append(monkeys[monkeyId].items, v)
		}
		monkeys[monkeyId].operands = input[monkeyId].operands
		monkeys[monkeyId].operation = input[monkeyId].operation
		monkeys[monkeyId].divisibilityTest = input[monkeyId].divisibilityTest
		monkeys[monkeyId].divisibilityTrue = input[monkeyId].divisibilityTrue
		monkeys[monkeyId].divisibilityFalse = input[monkeyId].divisibilityFalse
	}

	for round := 0; round < 20; round++ {
		for monkeyId := 0; monkeyId < len(monkeys); monkeyId++ {
			monkey := monkeys[monkeyId]
			for _, item := range monkey.items {
				inspected[monkeyId]++
				newWorry := getWorry(item, monkey.operands, monkey.operation) / 3
				if newWorry%monkey.divisibilityTest == 0 {
					monkeys[monkey.divisibilityTrue].items = append(monkeys[monkey.divisibilityTrue].items, newWorry)
				} else {
					monkeys[monkey.divisibilityFalse].items = append(monkeys[monkey.divisibilityFalse].items, newWorry)
				}
			}
			monkeys[monkeyId].items = nil
		}
	}

	sort.Ints(inspected)

	result = Part1Type(inspected[len(inspected)-1] * inspected[len(inspected)-2])

	return
}

func part2(input []InputType, res1 Part1Type) (result Part2Type) {
	inspected := make([]int, len(input))
	var worryManager int = 1
	monkeys := make([]InputType, len(input))
	for monkeyId := 0; monkeyId < len(monkeys); monkeyId++ {
		monkeys[monkeyId].items = make([]int, 0)
		for _, v := range input[monkeyId].items {
			monkeys[monkeyId].items = append(monkeys[monkeyId].items, v)
		}
		monkeys[monkeyId].operands = input[monkeyId].operands
		monkeys[monkeyId].operation = input[monkeyId].operation
		monkeys[monkeyId].divisibilityTest = input[monkeyId].divisibilityTest
		monkeys[monkeyId].divisibilityTrue = input[monkeyId].divisibilityTrue
		monkeys[monkeyId].divisibilityFalse = input[monkeyId].divisibilityFalse

		worryManager *= monkeys[monkeyId].divisibilityTest
	}

	for round := 0; round < 10000; round++ {
		for monkeyId := 0; monkeyId < len(monkeys); monkeyId++ {
			monkey := monkeys[monkeyId]
			for itemId := 0; itemId < len(monkey.items); itemId++ {
				item := monkey.items[itemId]
				inspected[monkeyId]++
				// Worry levels are too high, even for int64
				// Mod on the product of all test to keep it low and not change the result
				newWorry := getWorry(item, monkey.operands, monkey.operation) % worryManager
				if newWorry%monkey.divisibilityTest == 0 {
					monkeys[monkey.divisibilityTrue].items = append(monkeys[monkey.divisibilityTrue].items, newWorry)
				} else {
					monkeys[monkey.divisibilityFalse].items = append(monkeys[monkey.divisibilityFalse].items, newWorry)
				}
			}
			monkeys[monkeyId].items = nil
		}
	}

	sort.Ints(inspected)

	result = Part2Type(inspected[len(inspected)-1] * inspected[len(inspected)-2])

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

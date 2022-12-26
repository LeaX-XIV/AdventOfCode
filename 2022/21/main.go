// https://adventofcode.com/2022/day/21
package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"strings"
)

type Part1Type int64
type Part2Type string
type InputType struct {
	name     string
	operands [2]string
	op       rune
	n        int64
	ready    bool
}

type Task struct {
	filename  string
	expected1 Part1Type
	expected2 Part2Type
	isTest    bool
}

var tasks = []Task{
	{filename: "test1.txt", expected1: 152, expected2: "150=(4+2*(x-3))/4" /* 301 */, isTest: true},
	{filename: "input.txt"},
}

func mapInputLine(line string) (InputType, error) {
	var res InputType

	nameYell := strings.Split(line, ": ")
	name, yell := nameYell[0], nameYell[1]

	res.name = name
	foo := strings.Fields(yell)
	if len(foo) == 1 {
		fmt.Sscanf(foo[0], "%d", &res.n)
		res.ready = true
	} else if len(foo) == 3 {
		res.operands[0] = foo[0]
		res.op = rune(foo[1][0])
		res.operands[1] = foo[2]
		res.ready = false
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

func createMap(monkeys []InputType) map[string]InputType {
	m := make(map[string]InputType)

	for _, monkey := range monkeys {
		m[monkey.name] = monkey
	}

	return m
}

func getMonkeyNum(monkeys *map[string]InputType, m string) int64 {
	monkey, ok := (*monkeys)[m]
	if !ok {
		panic("No monkey '" + m + "'")
	}

	if monkey.ready {
		return monkey.n
	}

	op1 := getMonkeyNum(monkeys, monkey.operands[0])
	op2 := getMonkeyNum(monkeys, monkey.operands[1])

	switch monkey.op {
	case '+':
		monkey.n = op1 + op2
	case '-':
		monkey.n = op1 - op2
	case '*':
		monkey.n = op1 * op2
	case '/':
		monkey.n = op1 / op2
	default:
		panic("No operation")
	}
	monkey.ready = true
	(*monkeys)[m] = monkey

	return monkey.n
}

func unready(monkeys *map[string]InputType, name string) {
	for k, m := range *monkeys {
		if k == name {
			m.ready = false
		} else if m.operands[0] == name || m.operands[1] == name {
			m.ready = false
			unready(monkeys, k)
		}
		(*monkeys)[k] = m
	}
}

func part1(input []InputType) (result Part1Type) {
	monkeysMap := createMap(input)

	getMonkeyNum(&monkeysMap, "root")

	result = Part1Type(monkeysMap["root"].n)

	return
}

// TODO: Make part 2 solvable locally
func part2(input []InputType, res1 Part1Type) (result Part2Type) {
	monkeysMap := createMap(input)

	m := monkeysMap["humn"]
	m.n = 0
	m.ready = true
	monkeysMap["humn"] = m
	getMonkeyNum(&monkeysMap, "root")
	rootOps0 := []int64{monkeysMap[monkeysMap["root"].operands[0]].n, monkeysMap[monkeysMap["root"].operands[1]].n}

	var humnDependentRootIdx int
	for i := 0; ; i++ {
		unready(&monkeysMap, "humn")
		m = monkeysMap["humn"]
		m.n = int64(i)
		m.ready = true
		monkeysMap["humn"] = m
		getMonkeyNum(&monkeysMap, "root")
		rootOps1 := []int64{monkeysMap[monkeysMap["root"].operands[0]].n, monkeysMap[monkeysMap["root"].operands[1]].n}

		if rootOps0[0] == rootOps1[0] && rootOps0[1] == rootOps1[1] {
			continue
		} else if rootOps0[0] != rootOps1[0] && rootOps0[1] == rootOps1[1] {
			humnDependentRootIdx = 0
		} else if rootOps0[0] == rootOps1[0] && rootOps0[1] != rootOps1[1] {
			humnDependentRootIdx = 1
		}
		break
	}

	unready(&monkeysMap, "humn")
	subStringKeys := []string{monkeysMap["root"].operands[humnDependentRootIdx]}
	expressionString := fmt.Sprintf("%d=%s", rootOps0[(humnDependentRootIdx+1)%len(rootOps0)], subStringKeys[0])
	for len(subStringKeys) > 0 {
		subStringKey := subStringKeys[0]
		subStringKeys = subStringKeys[1:]

		var subStringValue string
		if subStringKey == "humn" {
			subStringValue = "x"
		} else if monkeysMap[subStringKey].ready {
			subStringValue = fmt.Sprintf("%d", monkeysMap[subStringKey].n)
		} else {
			formatStr := "(%s%c%s)"
			if monkeysMap[subStringKey].op == '*' || monkeysMap[subStringKey].op == '/' {
				formatStr = "%s%c%s"
			}
			subStringValue = fmt.Sprintf(formatStr, monkeysMap[subStringKey].operands[0], monkeysMap[subStringKey].op, monkeysMap[subStringKey].operands[1])
			subStringKeys = append(subStringKeys, monkeysMap[subStringKey].operands[0])
			subStringKeys = append(subStringKeys, monkeysMap[subStringKey].operands[1])
		}

		expressionString = strings.ReplaceAll(expressionString, subStringKey, subStringValue)
	}

	result = Part2Type(expressionString)

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

	if !*runP1 {
		fmt.Println("\n" +
			"Part 2 solution returns an expression as a string.\n" +
			"Copy the string and use an online equation solver to solve for x.\n" +
			"The value of x is the solution to Part 2.\n" +
			"You can try https://www.dcode.fr/equation-solver with options:\n" +
			"\tSolving Domain Set: Z (Integers Z)\n" +
			"\tResult Format: Exact Value (when possible)\n",
		)
	}

	for _, t := range tasks {
		if !*runTests && t.isTest {
			// Don't run test cases
			continue
		}
		solveProblem(t, *runP1)
	}
}

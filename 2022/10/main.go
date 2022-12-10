// https://adventofcode.com/2022/day/10
package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"strings"
)

type Part1Type int
type Part2Type string
type InputType struct {
	op Op
	v  int
}
type Op int

const (
	Addx Op = iota
	Noop
)

type Task struct {
	filename  string
	expected1 Part1Type
	expected2 Part2Type
	isTest    bool
}

var tasks = []Task{
	{filename: "test1.txt", expected1: 13140, expected2: "\n██  ██  ██  ██  ██  ██  ██  ██  ██  ██  \n" +
		"███   ███   ███   ███   ███   ███   ███ \n" +
		"████    ████    ████    ████    ████    \n" +
		"█████     █████     █████     █████     \n" +
		"██████      ██████      ██████      ████\n" +
		"███████       ███████       ███████     ", isTest: true},
	{filename: "input.txt"},
}

func mapInputLine(line string) (InputType, error) {
	var res InputType

	var opstr string
	_, err := fmt.Sscanf(line, "%s %d", &opstr, &res.v)
	if err == nil {
		switch opstr {
		case "addx":
			res.op = Addx
		}
	}

	_, err = fmt.Sscanf(line, "%s", &opstr)
	if err == nil {
		switch opstr {
		case "noop":
			res.op = Noop
		}
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

func part1(input []InputType) (result Part1Type) {
	X := 1
	signalStrength := 0

	var toComplete *InputType
	var completeAfter int

	i := -1
	for clock := 1; i < len(input)-1; clock++ {
		var op *InputType
		if (clock-20)%40 == 0 {
			signalStrength += X * clock
		}

		if toComplete == nil {
			i++
			op = &input[i]

			toComplete = op
			switch op.op {
			case Noop:
				completeAfter = clock
			case Addx:
				completeAfter = clock + 1
			default:
				fmt.Println(op.op)
			}
		}

		if completeAfter == clock {
			switch toComplete.op {
			case Addx:
				X += toComplete.v
			case Noop:
				{
				}
			}
			toComplete = nil
		}
	}

	result = Part1Type(signalStrength)

	return
}

func part2(input []InputType, res1 Part1Type) (result Part2Type) {
	X := 1
	screen := []string{
		"                                        ",
		"                                        ",
		"                                        ",
		"                                        ",
		"                                        ",
		"                                        ",
	}

	var toComplete *InputType
	var completeAfter int

	i := -1
	for clock := 1; i < len(input)-1; clock++ {
		var op *InputType

		row := (clock - 1) / 40
		col := (clock - 1) % 40
		if col == X || col == X-1 || col == X+1 {
			s := []byte(screen[row])
			s[col] = '#'
			screen[row] = string(s)
		}

		if toComplete == nil {
			i++
			op = &input[i]

			toComplete = op
			switch op.op {
			case Noop:
				completeAfter = clock
			case Addx:
				completeAfter = clock + 1
			default:
				fmt.Println(op.op)
			}
		}

		if completeAfter == clock {
			switch toComplete.op {
			case Addx:
				X += toComplete.v
			case Noop:
			}
			toComplete = nil
		}
	}

	result = Part2Type(strings.Replace("\n"+strings.Join(screen, "\n"), "#", "█", -1))

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

// https://adventofcode.com/2022/day/25
package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"strings"
)

type Part1Type string
type InputType int

type Task struct {
	filename  string
	expected1 Part1Type
	isTest    bool
}

var tasks = []Task{
	{filename: "test1.txt", expected1: "2=-1=0", isTest: true},
	{filename: "test2.txt", expected1: "1121-121=0--2", isTest: true},
	{filename: "input.txt"},
}

func pow(b, e int) int {
	p := 1
	for i := 0; i < e; i++ {
		p *= b
	}
	return p
}

func mapInputLine(line string) (InputType, error) {
	var res InputType

	n := 0
	for i := 0; i < len(line); i++ {
		c := line[len(line) - i - 1]
		switch c {
		case '=': n += (-2) * pow(5, i)
		case '-': n += (-1) * pow(5, i)
		case '0': n += 0 * pow(5, i)
		case '1': n += 1 * pow(5, i)
		case '2': n += 2 * pow(5, i)
		default: panic("Wrong SNAFU digit")
		}
	}

	res = InputType(n)

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

func toSNAFU(n int) string {
	s := ""
	for n > 0 {
		rem := n % 5
		s = []string{"0", "1", "2", "=", "-"}[rem] + s
		if rem == 3 {
			n -= -2
		} else if rem == 4 {
			n -= -1
		}
		n /= 5
	}

	return s
}

func part1(input []InputType) (result Part1Type) {
	sum := 0

	for _, n := range input {
		sum += int(n)
	}

	result = Part1Type(toSNAFU(sum))

	return
}

func solveProblem(task Task) {
	var (
		filename  = task.filename
		expected1 = task.expected1
		doAssert  = task.isTest
		actual1   Part1Type
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
}

func main() {
	runTests := flag.Bool("tests", false, "Run test cases")
	flag.Parse()

	for _, t := range tasks {
		if !*runTests && t.isTest {
			// Don't run test cases
			continue
		}
		solveProblem(t)
	}
}
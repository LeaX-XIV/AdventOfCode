// https://adventofcode.com/2022/day/13
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
type InputType List
type List []Comp
type Int int
type Comp interface {
	compare(Comp) Order
}
type Order int

const (
	LT Order = iota
	EQ
	GT
)

func (a Int) compare(b Comp) Order {
	switch b.(type) {
	case List:
		return List{a}.compare(b)
	case Int:
		return compareInts(a, b.(Int))
	}

	return EQ
}

func (a List) compare(b Comp) Order {
	switch b.(type) {
	case List:
		return compareLists(a, b.(List))
	case Int:
		return a.compare(List{b})
	}

	return EQ
}

func compareInts(a, b Int) Order {
	if a == b {
		return EQ
	}
	if a < b {
		return LT
	}
	return GT
}

func compareLists(a, b List) Order {
	minL := len(a)
	if len(b) < minL {
		minL = len(b)
	}
	for i := 0; i < minL; i++ {
		if comp := a[i].compare(b[i]); comp != EQ {
			return comp
		}
	}
	if len(a) == len(b) {
		return EQ
	}
	if len(a) < len(b) {
		return LT
	}
	return GT
}

type Packets []InputType

// implement the functions from the sort.Interface
func (p Packets) Len() int {
	return len(p)
}

func (p Packets) Less(i, j int) bool {
	return List(p[i]).compare(List(p[j])) == LT
}

func (p Packets) Swap(i, j int) {
	p[i], p[j] = p[j], p[i]
}

type Task struct {
	filename  string
	expected1 Part1Type
	expected2 Part2Type
	isTest    bool
}

var tasks = []Task{
	{filename: "test1.txt", expected1: 13, expected2: 140, isTest: true},
	{filename: "input.txt"},
}

func parseList(s string, i *int) List {
	list := make([]Comp, 0)
	start := *i
	for ; *i < len(s); *i++ {
		if s[*i] == ',' {
			if start == *i {
				start = *i + 1
				continue
			}
			var n int
			fmt.Sscanf(s[start:*i], "%d", &n)
			list = append(list, Int(n))
			start = *i + 1
		}
		if s[*i] == '[' {
			*i++
			list = append(list, parseList(s, i))
			start = *i + 1
		}
		if s[*i] == ']' {
			*i++
			break
		}

	}
	if start < *i-1 {
		var n int
		fmt.Sscanf(s[start:*i], "%d", &n)
		list = append(list, Int(n))
	}
	return List(list)
}

func mapInputLine(line string) (InputType, error) {
	var res InputType

	i := 1
	res = InputType(parseList(line, &i))

	return res, nil
}

func prepareInput(filename string) ([]InputType, error) {
	bs, err := ioutil.ReadFile(filename)
	if err != nil {
		return nil, err
	}
	contents := string(bs)
	contents = strings.Replace(contents, "\r", "", -1)
	contents = strings.Replace(contents, "\n\n", "\n", -1)
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
	correctOrder := 0

	for i := 0; i < len(input); i += 2 {
		if List(input[i]).compare(List(input[i+1])) == LT {
			correctOrder += i/2 + 1
		}
	}

	result = Part1Type(correctOrder)

	return
}

func part2(input []InputType, res1 Part1Type) (result Part2Type) {
	extraPacket1, _ := mapInputLine("[[2]]")
	extraPacket2, _ := mapInputLine("[[6]]")
	input = append(input, extraPacket1)
	input = append(input, extraPacket2)
	sort.Sort(Packets(input))

	decoderKey := 1
	for i, p := range input {
		if List(p).compare(List(extraPacket1)) == EQ || List(p).compare(List(extraPacket2)) == EQ {
			decoderKey *= i + 1
		}
	}

	result = Part2Type(decoderKey)

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

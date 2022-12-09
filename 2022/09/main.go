// https://adventofcode.com/2022/day/9
package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"strings"
)

type Part1Type int
type Part2Type int
type InputType struct {
	d     Direction
	steps int
}
type Direction int

const (
	Up Direction = iota
	Right
	Down
	Left
)

type Position struct {
	x, y int
}

func (p *Position) plus(a Position) *Position {
	p.x += a.x
	p.y += a.y

	return p
}

func (p *Position) minus(a Position) *Position {
	p.x -= a.x
	p.y -= a.y

	return p
}

var directions = []Position{
	Position{x: 0, y: 1},
	Position{x: 1, y: 0},
	Position{x: 0, y: -1},
	Position{x: -1, y: 0},
}

type Task struct {
	filename  string
	expected1 Part1Type
	expected2 Part2Type
	isTest    bool
}

var tasks = []Task{
	{filename: "test1.txt", expected1: 13, expected2: 1, isTest: true},
	{filename: "test2.txt", expected1: 88, expected2: 36, isTest: true},
	{filename: "input.txt"},
}

func mapInputLine(line string) (InputType, error) {
	var res InputType

	var dirStr string
	_, err := fmt.Sscanf(line, "%s %d", &dirStr, &res.steps)
	if err != nil {
		return res, err
	}

	switch dirStr {
	case "U":
		res.d = Up
	case "R":
		res.d = Right
	case "D":
		res.d = Down
	case "L":
		res.d = Left
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

func areAdjacent(a, b Position) (bool, Position) {
	d := b
	d.minus(a)

	return d.x < 2 && d.x > -2 && d.y < 2 && d.y > -2, d
}

func areNotAdjacentOnSameLine(a, b Position) (bool, Position) {
	adj, d := areAdjacent(a, b)

	return d.x*d.y == 0 && !adj, d
}

func areNotAdjacentOnDifferentLine(a, b Position) (bool, Position) {
	adj, d := areAdjacent(a, b)
	notAdjLine, _ := areNotAdjacentOnSameLine(a, b)

	return !adj && !notAdjLine, d
}

func follow(from, to Position) (delta Position) {
	delta = Position{x: 0, y: 0}
	if notAdj, d := areNotAdjacentOnDifferentLine(from, to); notAdj {
		if d.x > 0 {
			delta.x++
		} else if d.x < 0 {
			delta.x--
		}
		if d.y > 0 {
			delta.y++
		} else if d.y < 0 {
			delta.y--
		}
	}
	if notAdj, d := areNotAdjacentOnSameLine(from, to); notAdj {
		if d.x < 0 {
			delta.x--
		} else if d.x > 0 {
			delta.x++
		} else if d.y < 0 {
			delta.y--
		} else if d.y > 0 {
			delta.y++
		}
	}

	return delta
}

func part1(input []InputType) (result Part1Type) {
	var visited = make(map[Position]bool)
	head := Position{x: 0, y: 0}
	tail := Position{x: 0, y: 0}
	visited[tail] = true

	for _, move := range input {
		for i := 0; i < move.steps; i++ {
			head.plus(directions[move.d])

			moveTail := follow(tail, head)
			tail.plus(moveTail)

			visited[tail] = true
		}
	}

	result = Part1Type(len(visited))

	return
}

func part2(input []InputType, res1 Part1Type) (result Part2Type) {
	var visited = make(map[Position]bool)
	rope := make([]Position, 10)
	for i := range rope {
		rope[i] = Position{x: 0, y: 0}
	}
	visited[rope[len(rope)-1]] = true

	for _, move := range input {
		for i := 0; i < move.steps; i++ {
			rope[0].plus(directions[move.d])

			for j := 1; j < len(rope); j++ {
				moveTail := follow(rope[j], rope[j-1])
				rope[j].plus(moveTail)
			}
			visited[rope[len(rope)-1]] = true
		}
	}

	result = Part2Type(len(visited))

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

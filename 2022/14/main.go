// https://adventofcode.com/2022/day/14
package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"strconv"
	"strings"
)

type Part1Type int
type Part2Type int
type InputType [][2]int
type Tile int

type Task struct {
	filename  string
	expected1 Part1Type
	expected2 Part2Type
	isTest    bool
}

var tasks = []Task{
	{filename: "test1.txt", expected1: 24, expected2: 93, isTest: true},
	{filename: "input.txt"},
}

const (
	AIR Tile = iota
	ROCK
	SAND
)

func mapInputLine(line string) (InputType, error) {
	var res InputType

	for _, coords := range strings.Split(line, " -> ") {
		xy := strings.Split(coords, ",")

		x, err := strconv.Atoi(xy[0])
		if err != nil {
			return res, err
		}
		y, err := strconv.Atoi(xy[1])
		if err != nil {
			return res, err
		}
		res = append(res, [2]int{x, y})
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

func constructMap(input []InputType) map[[2]int]Tile {
	m := make(map[[2]int]Tile)

	for _, rocks := range input {
		for i := 1; i < len(rocks); i++ {
			r1 := rocks[i-1]
			r2 := rocks[i]
			var dir [2]int
			if r1[0] == r2[0] {
				// Vertical
				if r1[1] < r2[1] {
					dir = [2]int{0, 1}
				} else {
					dir = [2]int{0, -1}
				}
			} else {
				// Horizontal
				if r1[0] < r2[0] {
					dir = [2]int{1, 0}
				} else {
					dir = [2]int{-1, 0}
				}
			}

			for r1 != r2 {
				m[r1] = ROCK

				r1[0] += dir[0]
				r1[1] += dir[1]
			}
			m[r1] = ROCK
		}
	}

	return m
}

func tryDirection(scan map[[2]int]Tile, current [2]int) (d [2]int, moved bool) {
	d = [2]int{0, 0}
	moved = false

	_, ok := scan[current]
	if !ok {
		// Try down
		_, ok = scan[[2]int{current[0], current[1] + 1}]
		if !ok {
			d[1]++
			moved = true
			return
		}
		// Try down-left
		_, ok = scan[[2]int{current[0] - 1, current[1] + 1}]
		if !ok {
			d[0]--
			d[1]++
			moved = true
			return
		}
		// Try down-right
		_, ok = scan[[2]int{current[0] + 1, current[1] + 1}]
		if !ok {
			d[0]++
			d[1]++
			moved = true
			return
		}
	}

	return d, moved
}

func part1(input []InputType) (result Part1Type) {
	scan := constructMap(input)
	maxY := 0
	sandStart := [2]int{500, 0}
	sandUnits := 0
	var currentSandPos [2]int

	for coords, _ := range scan {
		if coords[1] > maxY {
			maxY = coords[1]
		}
	}

	for currentSandPos[1] <= maxY {
		currentSandPos = sandStart
		for currentSandPos[1] <= maxY {
			d, move := tryDirection(scan, currentSandPos)
			if move {
				currentSandPos[0] += d[0]
				currentSandPos[1] += d[1]
			} else {
				// Sand comes to a rest
				scan[currentSandPos] = SAND
				break
			}
		}
	}

	for _, t := range scan {
		if t == SAND {
			sandUnits++
		}
	}

	result = Part1Type(sandUnits)

	return
}

func part2(input []InputType, res1 Part1Type) (result Part2Type) {
	scan := constructMap(input)
	maxY := 0
	sandStart := [2]int{500, 0}
	sandUnits := 0
	var currentSandPos [2]int

	for coords, _ := range scan {
		if coords[1] > maxY {
			maxY = coords[1]
		}
	}

	for currentSandPos[0] != sandStart[0] || currentSandPos[1] != sandStart[1] {
		currentSandPos = sandStart
		for {
			if currentSandPos[1] == maxY+1 {
				// Sand reaches floor
				scan[currentSandPos] = SAND
				break
			}

			d, move := tryDirection(scan, currentSandPos)
			if move {
				currentSandPos[0] += d[0]
				currentSandPos[1] += d[1]
			} else {
				// Sand comes to a rest
				scan[currentSandPos] = SAND
				break
			}
		}
	}

	for _, t := range scan {
		if t == SAND {
			sandUnits++
		}
	}

	result = Part2Type(sandUnits)

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

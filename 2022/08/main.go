// https://adventofcode.com/2022/day/8
package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"math"
	"strconv"
	"strings"
)

type Part1Type int
type Part2Type int
type InputType []int

type Task struct {
	filename  string
	expected1 Part1Type
	expected2 Part2Type
	isTest    bool
}

var tasks = []Task{
	{filename: "test1.txt", expected1: 21, expected2: 8, isTest: true},
	{filename: "input.txt"},
}

func mapInputLine(line string) (InputType, error) {
	var res InputType

	for _, n := range line {
		num, err := strconv.Atoi(string(n))
		if err != nil {
			return res, err
		}
		res = append(res, num)
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

func isTreeVisible(field []InputType, x, y int) bool {
	visible := []bool{true, true, true, true}
	dirs := [][2]int{
		{0, -1},
		{0, 1},
		{-1, 0},
		{1, 0},
	}

	for i, dir := range dirs {
		ddy := dir[0]
		ddx := dir[1]

		dx := ddx
		dy := ddy
		for visible[i] && y+dy >= 0 && y+dy < len(field) && x+dx >= 0 && x+dx < len(field[y]) {
			if field[y+dy][x+dx] >= field[y][x] {
				visible[i] = false
			}

			dx += ddx
			dy += ddy
		}
	}

	return visible[0] || visible[1] || visible[2] || visible[3]
}

func scenicScore(field []InputType, x, y int) int {
	scores := []int{0, 0, 0, 0}
	dirs := [][2]int{
		{0, -1},
		{0, 1},
		{-1, 0},
		{1, 0},
	}

	for i, dir := range dirs {
		ddy := dir[0]
		ddx := dir[1]

		dx := ddx
		dy := ddy
		for y+dy >= 0 && y+dy < len(field) && x+dx >= 0 && x+dx < len(field[y]) {
			scores[i]++
			if field[y+dy][x+dx] >= field[y][x] {
				break
			}

			dx += ddx
			dy += ddy
		}
	}

	return scores[0] * scores[1] * scores[2] * scores[3]
}

func part1(input []InputType) (result Part1Type) {
	count := 2 * (len(input) + len(input[0]) - 2)

	for y := 1; y < len(input)-1; y++ {
		for x := 1; x < len(input[y])-1; x++ {
			if isTreeVisible(input, x, y) {
				count++
			}
		}
	}

	result = Part1Type(count)

	return
}

func part2(input []InputType, res1 Part1Type) (result Part2Type) {
	maxScenicScore := math.MinInt

	for y := 1; y < len(input)-1; y++ {
		for x := 1; x < len(input[y])-1; x++ {
			scenicScore := scenicScore(input, x, y)
			if scenicScore > maxScenicScore {
				maxScenicScore = scenicScore
			}
		}
	}

	result = Part2Type(maxScenicScore)

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

// https://adventofcode.com/2022/day/18
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
	x, y, z int
}
type Task struct {
	filename  string
	expected1 Part1Type
	expected2 Part2Type
	isTest    bool
}

var tasks = []Task{
	{filename: "test1.txt", expected1: 10, expected2: 10, isTest: true},
	{filename: "test2.txt", expected1: 64, expected2: 58, isTest: true},
	{filename: "input.txt"},
}

func mapInputLine(line string) (InputType, error) {
	var res InputType

	fmt.Sscanf(line, "%d,%d,%d", &res.x, &res.y, &res.z)

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

func countSurfaceArea(cubes []InputType) int {
	surfaceArea := 6 * len(cubes)

	for i := 0; i < len(cubes); i++ {
		d1 := cubes[i]
		for j := i + 1; j < len(cubes); j++ {
			d2 := cubes[j]
			if d1.x+1 == d2.x && d1.y == d2.y && d1.z == d2.z ||
				d1.x-1 == d2.x && d1.y == d2.y && d1.z == d2.z ||
				d1.x == d2.x && d1.y+1 == d2.y && d1.z == d2.z ||
				d1.x == d2.x && d1.y-1 == d2.y && d1.z == d2.z ||
				d1.x == d2.x && d1.y == d2.y && d1.z+1 == d2.z ||
				d1.x == d2.x && d1.y == d2.y && d1.z-1 == d2.z {

				surfaceArea -= 2
			}
		}
	}

	return surfaceArea
}

func contains(a []InputType, e InputType) bool {
	for _, v := range a {
		if v == e {
			return true
		}
	}

	return false
}

func flood(cubes, reach *[]InputType, current InputType) {
	if contains(*reach, current) {
		return
	}

	*reach = append(*reach, current)
	adj := []InputType{
		InputType{current.x + 1, current.y, current.z},
		InputType{current.x - 1, current.y, current.z},
		InputType{current.x, current.y + 1, current.z},
		InputType{current.x, current.y - 1, current.z},
		InputType{current.x, current.y, current.z + 1},
		InputType{current.x, current.y, current.z - 1},
	}
	for _, next := range adj {
		if !contains(*cubes, next) && !contains(*reach, next) &&
			next.x >= 0 && next.x < 30 &&
			next.y >= 0 && next.y < 30 &&
			next.z >= 0 && next.z < 30 {

			flood(cubes, reach, next)
		}
	}

	return
}

func part1(input []InputType) (result Part1Type) {
	result = Part1Type(countSurfaceArea(input))
	return
}

func part2(input []InputType, res1 Part1Type) (result Part2Type) {
	minX, maxX, minY, maxY, minZ, maxZ := 0, 30, 0, 30, 0, 30
	airPocket := make([]InputType, 0)
	external := make([]InputType, 0)
	flood(&input, &external, InputType{0, 0, 0})

	for x := minX; x < maxX; x++ {
		for y := minY; y < maxY; y++ {
			for z := minZ; z < maxZ; z++ {
				coord := InputType{x, y, z}
				if contains(input, coord) || contains(external, coord) {
					continue
				}

				airPocket = append(airPocket, coord)
			}
		}
	}

	result = Part2Type(countSurfaceArea(input) - countSurfaceArea(airPocket))

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

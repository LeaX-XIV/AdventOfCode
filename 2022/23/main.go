// https://adventofcode.com/2022/day/23
package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"math"
	"strings"
)

type Part1Type int
type Part2Type int
type InputType []rune

type Task struct {
	filename  string
	expected1 Part1Type
	expected2 Part2Type
	isTest    bool
}

type Position struct {
	x, y int
}

func (p Position) add(a Position) Position {
	p.x += a.x
	p.y += a.y

	return p
}

var directions = []Position{
	Position{-1, -1}, // NW
	Position{0, -1},  // N
	Position{+1, -1}, // NE
	Position{+1, 0},  // E
	Position{+1, +1}, // SE
	Position{0, +1},  // S
	Position{-1, +1}, // SW
	Position{-1, 0},  // W
}

var turnStartDirectionIdx = []int{1, 5, 7, 3}

var tasks = []Task{
	{filename: "test1.txt", expected1: 25, expected2: 4, isTest: true},
	{filename: "test2.txt", expected1: 110, expected2: 20, isTest: true},
	{filename: "input.txt"},
}

func mapInputLine(line string) (InputType, error) {
	var res InputType

	for _, r := range line {
		res = append(res, r)
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

func createMap(input []InputType) map[Position]struct{} {
	m := make(map[Position]struct{})

	for y, line := range input {
		for x, r := range line {
			if r == '#' {
				m[Position{x, y}] = struct{}{}
			}
		}
	}

	return m
}

func isSurrounded(p Position, m *map[Position]struct{}) bool {
	for _, d := range directions {
		if _, ok := (*m)[p.add(d)]; ok {
			return true
		}
	}

	return false
}

func part1(input []InputType) (result Part1Type) {
	elves := createMap(input)

	for i := 0; i < 10; i++ {
		elvesProposed := make(map[Position]Position)
		roundProposed := make(map[Position]int)
		for pos := range elves {
			elvesProposed[pos] = pos
			if isSurrounded(pos, &elves) {
				for j := 0; j < 4; j++ {
					proposeDirIdx := turnStartDirectionIdx[(i+j)%len(turnStartDirectionIdx)]
					propose := true
					for k := -1; k <= 1; k++ {
						checkIdx := (proposeDirIdx + k) % len(directions)
						if _, ok := elves[pos.add(directions[checkIdx])]; ok {
							propose = false
						}
					}
					if propose {
						proposeDir := pos.add(directions[proposeDirIdx])
						elvesProposed[pos] = proposeDir
						q, ok := roundProposed[proposeDir]
						if ok {
							q += 1
							roundProposed[proposeDir] = q
						} else {
							roundProposed[proposeDir] = 1
						}
						break
					}
				}
			}
		}

		newElves := make(map[Position]struct{})
		for pos := range elves {
			newPos, ok := elvesProposed[pos]
			if !ok {
				panic("No new position for elf")
			}

			q, ok := roundProposed[newPos]
			if !ok || q > 1 {
				newElves[pos] = struct{}{}
			} else if q == 1 {
				newElves[newPos] = struct{}{}
			}
		}
		elves = newElves
	}

	minX := math.MaxInt
	minY := math.MaxInt
	maxX := math.MinInt
	maxY := math.MinInt

	for p := range elves {
		if p.x < minX {
			minX = p.x
		} else if p.x > maxX {
			maxX = p.x
		}
		if p.y < minY {
			minY = p.y
		} else if p.y > maxY {
			maxY = p.y
		}
	}

	w := maxX - minX + 1
	h := maxY - minY + 1

	result = Part1Type(w*h - len(elves))

	return
}

func part2(input []InputType, res1 Part1Type) (result Part2Type) {
	elves := createMap(input)

	for i := 0; ; i++ {
		elvesProposed := make(map[Position]Position)
		roundProposed := make(map[Position]int)
		for pos := range elves {
			elvesProposed[pos] = pos
			if isSurrounded(pos, &elves) {
				for j := 0; j < 4; j++ {
					proposeDirIdx := turnStartDirectionIdx[(i+j)%len(turnStartDirectionIdx)]
					propose := true
					for k := -1; k <= 1; k++ {
						checkIdx := (proposeDirIdx + k) % len(directions)
						if _, ok := elves[pos.add(directions[checkIdx])]; ok {
							propose = false
						}
					}
					if propose {
						proposeDir := pos.add(directions[proposeDirIdx])
						elvesProposed[pos] = proposeDir
						q, ok := roundProposed[proposeDir]
						if ok {
							q += 1
							roundProposed[proposeDir] = q
						} else {
							roundProposed[proposeDir] = 1
						}
						break
					}
				}
			}
		}

		newElves := make(map[Position]struct{})
		for pos := range elves {
			newPos, ok := elvesProposed[pos]
			if !ok {
				panic("No new position for elf")
			}

			q, ok := roundProposed[newPos]
			if !ok || q > 1 {
				newElves[pos] = struct{}{}
			} else if q == 1 {
				newElves[newPos] = struct{}{}
			}
		}

		moved := false
		for p := range newElves {
			if _, ok := elves[p]; !ok {
				moved = true
			}
		}
		if !moved {
			result = Part2Type(i + 1)
			break
		}

		elves = newElves
	}

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

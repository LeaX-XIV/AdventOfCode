// https://adventofcode.com/2022/day/24
package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"strings"
	"math"
)

type Part1Type int
type Part2Type int
type InputType []rune

type Position struct {
	x, y int
}

type Direction Position

type State struct {
	time int
	p Position
}

func (p Position) move(a Direction) Position {
	p.x += a.x
	p.y += a.y

	return p
}

func (p Position) moveInverted(a Direction) Position {
	p.x -= a.x
	p.y -= a.y

	return p
}

var directions = []Direction {
	Direction{0, -1},	// N
	Direction{+1, 0},	// E
	Direction{0, +1},	// S
	Direction{-1, 0},	// W
	Direction{0, 0},	// Still
}

type Task struct {
	filename  string
	expected1 Part1Type
	expected2 Part2Type
	isTest    bool
}

var tasks = []Task{
	{filename: "test1.txt", expected1: 10, expected2: 32, isTest: true},
	{filename: "test2.txt", expected1: 18, expected2: 54, isTest: true},
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

func createBlizzardMap(input []InputType) map[Position][]Direction {
	m := make(map[Position][]Direction)

	for y, line := range input {
		for x, tile := range line {
			a := make([]Direction, 0)
			switch tile {
			case '^': a = append(a, directions[0])
			case '>': a = append(a, directions[1])
			case 'v': a = append(a, directions[2])
			case '<': a = append(a, directions[3])
			default: {}
			}
			m[Position{x, y}] = a
		}
	}

	return m
}

func moveBlizzard(b *map[Position][]Direction, maxX, maxY int, forward bool) {
	nextB := make(map[Position][]Direction)
	for p := range *b {
		nextB[p] = make([]Direction, 0)
	}

	for p, ds := range *b {
		for _, d := range ds {
			newP := p.move(d)
			if !forward {
				newP = p.moveInverted(d)
			}
			if newP.x <= 0 { newP.x = maxX }
			if newP.x > maxX { newP.x = 1 }
			if newP.y <= 0 { newP.y = maxY }
			if newP.y > maxY { newP.y = 1 }

			a := nextB[newP]
			a = append(a, d)
			nextB[newP] = a
		}
	}

	*b =  nextB
}

func navigateMaze(s, e Position, blizMap *map[Position][]Direction, maxX, maxY, blizzardTime int, minTime *int) {
	queue := []State{State{blizzardTime, s}}
	visited := make(map[State]struct{})
	
	for len(queue) > 0 {
		currentState := queue[0]
		queue = queue[1:]
		if _, seen := visited[currentState]; seen {
			continue
		}
		visited[currentState] = struct{}{}

		time, p := currentState.time, currentState.p

		if time >= *minTime {
			// Pruning
			continue
		}
		if p == e {
			// Goal reached
			if time < *minTime {
				*minTime = time
				// fmt.Println(*minTime)
			}
			continue
		}
		// Move blizzard to match state time
		for blizzardTime < time + 1 {
			moveBlizzard(blizMap, maxX, maxY, true)
			blizzardTime += 1
		}
		for blizzardTime > time + 1 {
			moveBlizzard(blizMap, maxX, maxY, false)
			blizzardTime -= 1
		}
		// Get which movements are possible based on next blizzard positions
		possibleMoves := make([]Direction, 0)
		for _, d := range directions {
			afterMove := p.move(d)
			// Check position bounds
			if afterMove != s && afterMove != e {
				if afterMove.x <= 0 || afterMove.x > maxX || afterMove.y <= 0 || afterMove.y > maxY {
					continue
				}
			}
			if len((*blizMap)[afterMove]) == 0 {
				possibleMoves = append(possibleMoves, d)
			}
		}
		if len(possibleMoves) == 0 {
			// No possible moves, next state
			continue
		}
		// Add all possible states to the queue, if not previously visited
		for _, m := range possibleMoves {
			newState := State{time + 1, p.move(m)}
			if _, seen := visited[newState]; !seen {
				queue = append(queue, newState)
			}
		}
	}
}

func part1(input []InputType) (result Part1Type) {
	maxX := len(input[0]) - 2
	maxY := len(input) - 2
	currPos := Position{1, 0}
	end := Position{len(input[0]) - 2, len(input) - 1}
	minTime := math.MaxInt

	blizzardMap := createBlizzardMap(input)

	navigateMaze(currPos, end, &blizzardMap, maxX, maxY, 0, &minTime)
	
	result = Part1Type(minTime)

	return
}

func part2(input []InputType, res1 Part1Type) (result Part2Type) {
	maxX := len(input[0]) - 2
	maxY := len(input) - 2
	currPos := Position{1, 0}
	end := Position{len(input[0]) - 2, len(input) - 1}
	minTime1 := math.MaxInt
	minTime2 := math.MaxInt
	minTime3 := math.MaxInt

	blizzardMap := createBlizzardMap(input)

	navigateMaze(currPos, end, &blizzardMap, maxX, maxY, 0, &minTime1)
	minTime1 += 1	// To compensate for blizzardTime being 1 more than the time
	navigateMaze(end, currPos, &blizzardMap, maxX, maxY, minTime1, &minTime2)
	minTime2 += 1	// To compensate for blizzardTime being 1 more than the time
	navigateMaze(currPos, end, &blizzardMap, maxX, maxY, minTime2, &minTime3)
	
	result = Part2Type(minTime3)
	
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
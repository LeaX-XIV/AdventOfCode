// https://adventofcode.com/2022/day/22
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
type InputType struct {
	path  []string
	space [][]rune
}

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

type Facing int

const (
	Right Facing = 0
	Down         = 1
	Left         = 2
	Up           = 3
)

type WrapCubeFace struct {
	sector int
	facing Facing
}

var directions = []Position{
	Position{1, 0},
	Position{0, 1},
	Position{-1, 0},
	Position{0, -1},
}

var tasks = []Task{
	{filename: "test1.txt", expected1: 6032, expected2: 5031, isTest: true},
	{filename: "input.txt"},
}

func mapInputLineSpace(line string) ([]rune, error) {
	res := make([]rune, len(line))

	for i, c := range line {
		res[i] = c
	}

	return res, nil
}

func prepareInput(filename string) (InputType, error) {
	var input InputType
	bs, err := ioutil.ReadFile(filename)
	if err != nil {
		return input, err
	}
	contents := string(bs)
	contents = strings.Replace(contents, "\r", "", -1)
	fields := strings.Split(contents, "\n\n")
	space, path := fields[0], fields[1]
	lines := strings.FieldsFunc(space, func(c rune) bool { return c == '\n' })

	path = strings.ReplaceAll(path, "L", " L ")
	path = strings.ReplaceAll(path, "R", " R ")

	input.path = strings.Fields(path)
	input.space = make([][]rune, len(lines))

	for i, s := range lines {
		mappedLine, err := mapInputLineSpace(s)
		if err != nil {
			return input, err
		}
		input.space[i] = mappedLine
	}

	return input, nil
}

func needWrapAround(p Position, space *[][]rune) bool {
	return !(p.y >= 0 && p.y < len(*space) && p.x >= 0 && p.x < len((*space)[p.y]) && (*space)[p.y][p.x] != ' ')
}

func wrapAroundPacMan(p *Position, facing Facing, space *[][]rune) {
	for {
		*p = p.add(directions[(facing+2)%4])
		if needWrapAround(*p, space) {
			break
		}
	}
	*p = p.add(directions[facing])
}

// Assuming cube is composed of 6 sections
//  EF
//  D
// BC
// A
// with each as a 50x50 square.
// Sectors are identified by their top-left corner
func wrapAroundCube(p *Position, facing Facing, space *[][]rune) Facing {
	sectors := []Position{
		Position{0, 150},
		Position{0, 100},
		Position{50, 100},
		Position{50, 50},
		Position{50, 0},
		Position{100, 0},
	}
	mapWrapCubeFace := map[WrapCubeFace]WrapCubeFace{
		{0, Left}:  {4, Down},
		{0, Down}:  {5, Down},
		{0, Right}: {2, Up},
		{1, Up}:    {3, Right},
		{1, Left}:  {4, Right},
		{2, Right}: {5, Left},
		{3, Right}: {5, Up},
		{4, Up}:    {0, Right},
		{5, Up}:    {0, Up},
		{2, Down}:  {0, Left},
		{3, Left}:  {1, Down},
		{5, Right}: {2, Left},
		{5, Down}:  {3, Left},
		{4, Left}:  {1, Right},
	}

	pp := p.add(directions[(facing+2)%4])
	var (
		sector int
		dx     int
		dy     int
	)
	for sector = 0; sector < len(sectors); sector++ {
		dx = pp.x - sectors[sector].x
		dy = pp.y - sectors[sector].y
		if dx >= 0 && dx < 50 && dy >= 0 && dy < 50 {
			break
		}
	}
	if sector >= len(sectors) {
		panic("No sector found")
	}

	wrapResult, ok := mapWrapCubeFace[WrapCubeFace{sector, facing}]
	if !ok {
		panic("Trying to wrap sector " +
			[]string{"A", "B", "C", "D", "E", "F"}[sector] +
			" going " +
			[]string{"right", "down", "left", "up"}[facing],
		)
	}

	switch wrapResult {
	// D -> B
	case WrapCubeFace{1, Down}:
		fallthrough
	// A -> C
	case WrapCubeFace{2, Up}:
		fallthrough
	// D -> F
	case WrapCubeFace{5, Up}:
		fallthrough
	// A -> E
	case WrapCubeFace{4, Down}:
		(*p).x = sectors[wrapResult.sector].x + dy

	// B -> D
	case WrapCubeFace{3, Right}:
		fallthrough
	// C -> A
	case WrapCubeFace{0, Left}:
		fallthrough
	// E -> A
	case WrapCubeFace{0, Right}:
		fallthrough
	// F -> D
	case WrapCubeFace{3, Left}:
		(*p).y = sectors[wrapResult.sector].y + dx

	// B <-> E   C <-> F
	case WrapCubeFace{4, Right}:
		fallthrough
	case WrapCubeFace{1, Right}:
		fallthrough
	case WrapCubeFace{2, Left}:
		fallthrough
	case WrapCubeFace{5, Left}:
		(*p).y = sectors[wrapResult.sector].y + 49 - dy

	// A <-> F
	case WrapCubeFace{0, Up}:
		fallthrough
	case WrapCubeFace{5, Down}:
		(*p).x = sectors[wrapResult.sector].x + dx

	default:
		panic("No option for entering sector " +
			[]string{"A", "B", "C", "D", "E", "F"}[wrapResult.sector] +
			" with direction " +
			[]string{"right", "down", "left", "up"}[wrapResult.facing],
		)
	}

	switch wrapResult.facing {
	case Right:
		(*p).x = sectors[wrapResult.sector].x
	case Down:
		(*p).y = sectors[wrapResult.sector].y
	case Left:
		(*p).x = sectors[wrapResult.sector].x + 49
	case Up:
		(*p).y = sectors[wrapResult.sector].y + 49
	}

	return wrapResult.facing
}

func isWall(p Position, space *[][]rune) bool {
	return (*space)[p.y][p.x] == '#'
}

func part1(input InputType) (result Part1Type) {
	currentFacing := Right
	currentPos := Position{0, 0}
	for input.space[currentPos.y][currentPos.x] != '.' {
		currentPos = currentPos.add(directions[Right])
	}

	for _, step := range input.path {
		forwardSteps, err := strconv.Atoi(step)
		if err == nil {
			for i := 0; i < forwardSteps; i++ {
				newP := currentPos.add(directions[currentFacing])
				if needWrapAround(newP, &input.space) {
					wrapAroundPacMan(&newP, currentFacing, &input.space)
				}
				if isWall(newP, &input.space) {
					break
				}
				currentPos = newP
			}
		} else {
			if step == "L" {
				currentFacing = (currentFacing + 3) % 4
			} else if step == "R" {
				currentFacing = (currentFacing + 1) % 4
			} else {
				panic("Unknown path token " + step)
			}
		}
	}

	result = Part1Type((currentPos.y+1)*1000 + (currentPos.x+1)*4 + int(currentFacing))

	return
}

func part2(input InputType, res1 Part1Type) (result Part2Type) {
	currentFacing := Right
	currentPos := Position{0, 0}
	for input.space[currentPos.y][currentPos.x] != '.' {
		currentPos = currentPos.add(directions[Right])
	}

	for _, step := range input.path {
		forwardSteps, err := strconv.Atoi(step)
		if err == nil {
			for i := 0; i < forwardSteps; i++ {
				newP := currentPos.add(directions[currentFacing])
				newFacing := currentFacing
				if needWrapAround(newP, &input.space) {
					newFacing = wrapAroundCube(&newP, currentFacing, &input.space)
				}
				if isWall(newP, &input.space) {
					break
				}
				currentPos = newP
				currentFacing = newFacing
			}
		} else {
			if step == "L" {
				currentFacing = (currentFacing + 3) % 4
			} else if step == "R" {
				currentFacing = (currentFacing + 1) % 4
			} else {
				panic("Unknown path token " + step)
			}
		}
	}

	result = Part2Type((currentPos.y+1)*1000 + (currentPos.x+1)*4 + int(currentFacing))

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
	if !runP1 && !doAssert {
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

	if *runTests {
		fmt.Println(
			"\n" +
				"Part 2 algorithm is hardcoded to work for input\n" +
				"Part 2 will not be solved for test input\n",
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

// https://adventofcode.com/2022/day/17
package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"strings"
)

type Part1Type int
type Part2Type int64
type InputType []Position

type Task struct {
	filename  string
	expected1 Part1Type
	expected2 Part2Type
	isTest    bool
}

type Position struct {
	x, y int
}
type StateKey struct {
	piece, step int
	dPos        Position
}
type StateValue struct {
	highest, nPiece int
}

func (p Position) plus(a Position) Position {
	p.x += a.x
	p.y += a.y

	return p
}

func (p Position) minus(a Position) Position {
	p.x -= a.x
	p.y -= a.y

	return p
}

var tasks = []Task{
	{filename: "test1.txt", expected1: 3068, expected2: 1514285714288, isTest: true},
	{filename: "input.txt"},
}

var pieces = [5][]Position{
	{{0, 0}, {1, 0}, {2, 0}, {3, 0}},         // -
	{{1, 0}, {0, 1}, {1, 1}, {2, 1}, {1, 2}}, // +
	{{0, 0}, {1, 0}, {2, 0}, {2, 1}, {2, 2}}, // L
	{{0, 0}, {0, 1}, {0, 2}, {0, 3}},         // I
	{{0, 0}, {0, 1}, {1, 0}, {1, 1}},         // SQUARE
}

func mapInputLine(line string) (InputType, error) {
	var res InputType

	for _, r := range line {
		d := Position{0, 0}
		switch r {
		case '<':
			d.x = -1
		case '>':
			d.x = 1
		default:
			panic("Unrecognized input char " + string(r))
		}
		res = append(res, d)
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

func move(piece *[]Position, direction Position) {
	for i, p := range *piece {
		(*piece)[i] = p.plus(direction)
	}
}

func canMove(piece []Position, direction Position, obstacles *map[Position]struct{}) bool {
	for _, p := range piece {
		newP := p.plus(direction)
		if _, hit := (*obstacles)[newP]; hit {
			return false
		} else if newP.x < 0 || newP.x >= 7 {
			return false
		}
	}

	return true
}

func dropPiece(piece []Position, obstacles *map[Position]struct{}, step *int, moves *InputType) (int, Position) {
	highest := 0
	for {
		dir := Position{0, 0}
		if *step%2 == 0 { // Input
			dir = dir.plus((*moves)[(*step/2)%len(*moves)])
		} else { // Down
			dir.y = -1
		}

		if canMove(piece, dir, obstacles) {
			move(&piece, dir)
		} else {
			if *step%2 == 1 {
				for _, p := range piece {
					(*obstacles)[p] = struct{}{}

					if p.y > highest {
						highest = p.y
					}
				}
				*step++
				break
			}
		}

		*step++
	}

	return highest, piece[0]
}

func part1(input []InputType) (result Part1Type) {
	highest := -1
	m := map[Position]struct{}{
		{0, -1}: struct{}{},
		{1, -1}: struct{}{},
		{2, -1}: struct{}{},
		{3, -1}: struct{}{},
		{4, -1}: struct{}{},
		{5, -1}: struct{}{},
		{6, -1}: struct{}{},
	}
	step := 0

	for nPieces := 0; nPieces < 2022; nPieces++ {
		pieceStartOffset := Position{2, highest + 4}
		piece := make([]Position, len(pieces[nPieces%len(pieces)]))
		for i, v := range pieces[nPieces%len(pieces)] {
			piece[i] = v.plus(pieceStartOffset)
		}

		newHigh, _ := dropPiece(piece, &m, &step, &input[0])
		if newHigh > highest {
			highest = newHigh
		}
	}

	result = Part1Type(highest + 1)

	return
}

func part2(input []InputType, res1 Part1Type) (result Part2Type) {
	m := map[Position]struct{}{
		{0, -1}: struct{}{},
		{1, -1}: struct{}{},
		{2, -1}: struct{}{},
		{3, -1}: struct{}{},
		{4, -1}: struct{}{},
		{5, -1}: struct{}{},
		{6, -1}: struct{}{},
	}

	nPieces := 0
	highest := -1
	step := 0
	states := make(map[StateKey]StateValue)
	ppos := Position{0, 0}
	period := 0
	periodGrowth := 0
	startGrowth := 0
	startPieces := 0
	remainder := 0
	remainderGrowth := -1
	highestCycleFound := 0
	for {
		pieceIdx := nPieces % len(pieces)
		startingMove := (step / 2) % len(input[0])

		pieceStartOffset := Position{2, highest + 4}
		piece := make([]Position, len(pieces[pieceIdx]))
		for i, v := range pieces[pieceIdx] {
			piece[i] = v.plus(pieceStartOffset)
		}

		newHigh, pos := dropPiece(piece, &m, &step, &input[0])
		if newHigh > highest {
			highest = newHigh
		}

		newStateK := StateKey{piece: pieceIdx, step: startingMove, dPos: pos.minus(ppos)}
		newStateV := StateValue{highest: highest, nPiece: nPieces}

		foundState, foundCycle := states[newStateK]
		if !foundCycle {
			states[newStateK] = newStateV
		} else {
			period = newStateV.nPiece - foundState.nPiece
			startPieces = foundState.nPiece
			periodGrowth = newStateV.highest - foundState.highest
			startGrowth = foundState.highest
			ppos = pos

			stepCopy := step
			mCopy := make(map[Position]struct{})
			for k, _ := range m {
				mCopy[k] = struct{}{}
			}

			remainder = (1000000000000 - startPieces) % period
			highestCycleFound = highest
			cont := true
			for i := 1; i < period; i++ {
				pieceIdx := (nPieces + i) % len(pieces)
				startingMove := (stepCopy / 2) % len(input[0])

				pieceStartOffset := Position{2, highest + 4}
				piece := make([]Position, len(pieces[pieceIdx]))
				for i, v := range pieces[pieceIdx] {
					piece[i] = v.plus(pieceStartOffset)
				}

				newHigh, pos := dropPiece(piece, &mCopy, &stepCopy, &input[0])
				if newHigh > highest {
					highest = newHigh
				}
				if i <= remainder {
					remainderGrowth = highest - highestCycleFound
				}

				newStateK := StateKey{piece: pieceIdx, step: startingMove, dPos: pos.minus(ppos)}
				if _, ok := states[newStateK]; !ok {
					cont = false
					ppos = pos
					highest = highestCycleFound
					break
				}
				ppos = pos
			}
			if cont {
				break
			}
		}

		ppos = pos
		nPieces++
	}

	result = Part2Type((1000000000000-startPieces)/period*periodGrowth + startGrowth + remainderGrowth)

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

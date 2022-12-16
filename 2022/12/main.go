// https://adventofcode.com/2022/day/12
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
type InputType []Node
type Node struct {
	height int
	edges  []*Node
}

type Task struct {
	filename  string
	expected1 Part1Type
	expected2 Part2Type
	isTest    bool
}

var tasks = []Task{
	{filename: "test1.txt", expected1: 31, expected2: 29, isTest: true},
	{filename: "input.txt"},
}

func mapInputLine(line string) (InputType, int, int, error) {
	var res InputType
	var S, E int = -1, -1

	for i, r := range line {
		n := Node{}
		n.edges = make([]*Node, 0)
		if r >= 'a' && r <= 'z' {
			n.height = int(r - 'a')
		} else if r == 'S' {
			n.height = 0
			S = i
		} else if r == 'E' {
			n.height = int('z' - 'a')
			E = i
		}
		res = append(res, n)
	}

	return res, S, E, nil
}

func prepareInput(filename string) ([]InputType, [2]int, [2]int, error) {
	bs, err := ioutil.ReadFile(filename)
	var S, E [2]int
	if err != nil {
		return nil, S, E, err
	}
	contents := string(bs)
	contents = strings.Replace(contents, "\r", "", -1)
	lines := strings.FieldsFunc(contents, func(c rune) bool { return c == '\n' })
	var input = make([]InputType, len(lines))

	for i, s := range lines {
		mappedLine, Sx, Ex, err := mapInputLine(s)
		if err != nil {
			return nil, S, E, err
		}
		if Sx >= 0 {
			S = [2]int{Sx, i}
		}
		if Ex >= 0 {
			E = [2]int{Ex, i}
		}
		input[i] = mappedLine
	}

	return input, S, E, nil
}

func connectEdges(input *[]InputType) {
	directions := [][2]int{
		{0, -1},
		{0, 1},
		{-1, 0},
		{1, 0},
	}
	for y := 0; y < len(*input); y++ {
		for x := 0; x < len((*input)[y]); x++ {
			(*input)[y][x].edges = nil
			for _, dir := range directions {
				newx := x + dir[0]
				newy := y + dir[1]
				if newx < 0 || newx >= len((*input)[y]) || newy < 0 || newy >= len(*input) {
					continue
				}

				if (*input)[y][x].height+1 >= (*input)[newy][newx].height {
					(*input)[y][x].edges = append((*input)[y][x].edges, &(*input)[newy][newx])
				}
			}
		}
	}
}

func dijkstraShortestPath(graph *[]InputType, source, end *Node, weights func(*Node, *Node) int) int {
	dist := make(map[*Node]int)
	prev := make(map[*Node]*Node)
	Q := make(map[*Node]struct{}, 0)
	for y := 0; y < len(*graph); y++ {
		for x := 0; x < len((*graph)[y]); x++ {
			dist[&(*graph)[y][x]] = math.MaxInt
			prev[&(*graph)[y][x]] = nil
			Q[&(*graph)[y][x]] = struct{}{}
		}
	}
	dist[source] = 0

	for len(Q) > 0 {
		var u *Node = nil
		minDist := math.MaxInt

		for n, _ := range Q {
			if dist[n] < minDist {
				minDist = dist[n]
				u = n
			}
		}
		delete(Q, u)
		if u == end || u == nil {
			break
		}

		for _, neigh := range u.edges {
			if _, ok := Q[neigh]; !ok {
				continue
			}
			alt := dist[u] + weights(u, neigh)
			if alt < dist[neigh] {
				dist[neigh] = alt
				prev[neigh] = u
			}
		}
	}

	return dist[end]
}

func part1(input []InputType, S, E [2]int) (result Part1Type) {
	connectEdges(&input)
	result = Part1Type(
		dijkstraShortestPath(
			&input,
			&input[S[1]][S[0]],
			&input[E[1]][E[0]],
			func(a, b *Node) int {
				ok := false
				for _, n := range a.edges {
					if n == b {
						ok = true
					}
				}
				if ok {
					return 1
				} else {
					return math.MaxInt
				}
			}))

	return
}

func part2(input []InputType, S, E [2]int, res1 Part1Type) (result Part2Type) {
	connectEdges(&input)
	minSteps := math.MaxInt
	for y := 0; y < len(input); y++ {
		for x := 0; x < len(input[y]); x++ {
			if input[y][x].height == 0 {
				steps := dijkstraShortestPath(
					&input,
					&input[y][x],
					&input[E[1]][E[0]],
					func(a, b *Node) int {
						dist := math.MaxInt
						for _, n := range a.edges {
							if n == b {
								dist = 1
								if a.height == 0 && b.height == 0 {
									dist = 0
								}
							}
						}
						return dist
					})

				if steps < minSteps {
					minSteps = steps
				}
			}
		}
	}

	result = Part2Type(minSteps)

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

	input, S, E, err := prepareInput(filename)
	if err != nil {
		fmt.Println(filename, "❌", "Error reading file", err)
		return
	} else {
		fmt.Println(filename)
	}

	fmt.Print("Part 1 ")
	actual1 = part1(input, S, E)
	if doAssert && expected1 != actual1 {
		fmt.Println("❌", "Expected:", expected1, "Actual", actual1)
	} else {
		fmt.Println("✅", actual1)
	}
	if !runP1 {
		fmt.Print("Part 2 ")
		actual2 = part2(input, S, E, actual1)
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

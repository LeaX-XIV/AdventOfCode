// https://adventofcode.com/2022/day/16
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
type InputType struct {
	name string
	flow int
	tunnel []string
}
type Valve struct {
	flow int
	near map[string]int
}

type Task struct {
	filename  string
	expected1 Part1Type
	expected2 Part2Type
	isTest    bool
}

var tasks = []Task{
	{filename: "test1.txt", expected1: 1651, expected2: 1707, isTest: true},
	{filename: "input.txt"},
}

func mapInputLine(line string) (InputType, error) {
	var res InputType

	fmt.Sscanf(line, "Valve %s has flow rate=%d; tunnels lead to valves ", &res.name, &res.flow)
	tunnels := strings.Split(line[49:], ", ")
	for _, t := range tunnels {
		res.tunnel = append(res.tunnel, strings.TrimLeft(t, " "))
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

func dijkstraShortestPathTo(graph *map[string]Valve, source string) map[string]int {
	dist := make(map[string]int)
	prev := make(map[string]*string)
	Q := make(map[string]struct{}, 0)
	for n, _ := range *graph {
		dist[n] = math.MaxInt
		prev[n] = nil
		Q[n] = struct{}{}
	}
	dist[source] = 0

	for len(Q) > 0 {
		var u string = ""
		minDist := math.MaxInt

		for n, _ := range Q {
			if dist[n] < minDist {
				minDist = dist[n]
				u = n
			}
		}
		delete(Q, u)

		for neigh, m := range (*graph)[u].near {
			if _, ok := Q[neigh]; !ok {
				continue
			}
			alt := dist[u] + m
			if alt < dist[neigh] {
				dist[neigh] = alt
				prev[neigh] = &u
			}
		}
	}

	return dist
}

func createMap(input []InputType) map[string]Valve {
	m := make(map[string]Valve)
	// Add nodes to graph
	for _, i := range input {
		m[i.name] = Valve {
			flow: i.flow,
			near: make(map[string]int),
		}
	}
	// Add edges to graph
	for _, i := range input {
		for _, to := range i.tunnel {
			if copy, ok := m[i.name]; ok {
				copy.near[to] = 1
				m[i.name] = copy
			}
		}
	}
	// Compute dijkstra for every node
	//  and construct fully connected graph
	for k, v := range m {
		dist := dijkstraShortestPathTo(&m, k)
		for to := range v.near {
			delete(v.near, to)
		}
		for to, minutes := range dist {
			if _, ok := m[to]; ok {
				if k != to {
					v.near[to] = minutes
				}
			}
		}
		m[k] = v
	}
	// Remove edges to nodes with flow 0 (except start AA)
	for k, v := range m {
		for to, _ := range v.near {
			if to != "AA" && m[to].flow == 0 {
				delete(v.near, to)
			}
		}
		m[k] = v
	}
	// Remove nodes with flow 0 (except start AA)
	for k, v := range m {
		if k != "AA" && v.flow == 0 {
			delete(m, k)
		}
	}
	return m
}

func dftVisitLimited(graph map[string]Valve, visited map[string]struct{}, currentValve string, timeLeft, flow int) int {
	if timeLeft <= 0 {
		return flow
	}
	if len(visited) == len(graph) {
		return flow
	}

	flow += graph[currentValve].flow * timeLeft
	maxFlow := flow
	visited[currentValve] = struct{}{}
	for k, v := range graph[currentValve].near {
		if _, skip := visited[k]; skip {
			continue
		}
		newFlow := dftVisitLimited(graph, visited, k, timeLeft - v - 1, flow)
		if newFlow > maxFlow {
			maxFlow = newFlow
		}
	}

	delete(visited, currentValve)
	return maxFlow
}

func dfsVisitLimited2(graph map[string]Valve, visited map[string]struct{}, valve1, valve2 string, time1, time2, maxTime, flow int) int {
	if maxTime <= 0 || len(visited) == len(graph) {
		return flow
	}

	if time1 > 0 && time2 > 0 {
		m := time1
		if time2 < m { m = time2 }
		if maxTime < m { m = maxTime }

		return dfsVisitLimited2(graph, visited, valve1, valve2, time1 - m, time2 - m, maxTime - m, flow)
	}

	// TODO: Prune the shit out of this code
	maxFlow := flow
	if time1 == 0 && time2 == 0 {
		flow += maxTime * (graph[valve1].flow + graph[valve2].flow)

		for k1, v1 := range graph[valve1].near {
			if _, skip := visited[k1]; skip {
				continue
			}
			visited[k1] = struct{}{}
			for k2, v2 := range graph[valve2].near {
				if _, skip := visited[k2]; skip {
					continue
				}
				visited[k2] = struct{}{}

				newFlow := dfsVisitLimited2(graph, visited, k1, k2, v1 + 1, v2 + 1, maxTime, flow)
				if newFlow > maxFlow {
					maxFlow = newFlow
				}

				delete(visited, k2)
			}
			delete(visited, k1)
		}
	} else if time1 == 0 {
		flow += maxTime * graph[valve1].flow
		for k, v := range graph[valve1].near {
			if _, skip := visited[k]; skip {
				continue
			}
			visited[k] = struct{}{}

			newFlow := dfsVisitLimited2(graph, visited, k, valve2, v + 1, time2, maxTime, flow)
			if newFlow > maxFlow {
				maxFlow = newFlow
			}

			delete(visited, k)
		}
	} else if time2 == 0 {
		flow += maxTime * graph[valve2].flow
		for k, v := range graph[valve2].near {
			if _, skip := visited[k]; skip {
				continue
			}
			visited[k] = struct{}{}

			newFlow := dfsVisitLimited2(graph, visited, valve1, k, time1, v + 1, maxTime, flow)
			if newFlow > maxFlow {
				maxFlow = newFlow
			}

			delete(visited, k)
		}
	}

	return maxFlow
}

func part1(input []InputType) (result Part1Type) {
	valves := createMap(input)
	maxFlow := dftVisitLimited(valves, map[string]struct{} {}, "AA", 30, 0)
	
	result = Part1Type(maxFlow)

	return
}

func part2(input []InputType, res1 Part1Type) (result Part2Type) {
	valves := createMap(input)
	maxFlow := dfsVisitLimited2(valves, map[string]struct{} {}, "AA", "AA", 0, 0, 26, 0)
	
	result = Part2Type(maxFlow)

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

	fmt.Println("Test for part 2 fails.")
	fmt.Println("Part 2 for input may take ~1h30m, correct solution not guaranteed.")

	for _, t := range tasks {
		if !*runTests && t.isTest {
			// Don't run test cases
			continue
		}
		solveProblem(t, *runP1)
	}
}
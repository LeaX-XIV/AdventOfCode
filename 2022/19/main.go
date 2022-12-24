// https://adventofcode.com/2022/day/19
package main

import (
	"flag"
	"fmt"
	"io/ioutil"
	"sort"
	"strings"
)

type Part1Type int
type Part2Type int
type InputType struct {
	id, maxGeodes int
	blueprint     map[Robot]map[Mineral]int
}
type Robot Mineral
type Mineral int

type Robots []Robot

// implement the functions from the sort.Interface
func (r Robots) Len() int {
	return len(r)
}

func (r Robots) Less(i, j int) bool {
	return int(r[i]) < int(r[j])
}

func (r Robots) Swap(i, j int) {
	r[i], r[j] = r[j], r[i]
}

const (
	None Mineral = iota
	Ore
	Clay
	Obsidian
	Geode
)

type Task struct {
	filename  string
	expected1 Part1Type
	expected2 Part2Type
	isTest    bool
}

var tasks = []Task{
	{filename: "test1.txt", expected1: 33, expected2: 56 * 62, isTest: true},
	{filename: "input.txt"},
}

func mapInputLine(line string) (InputType, error) {
	var res InputType

	var (
		oreRobotOre,
		clayRobotOre,
		obsidianRobotOre,
		obsidianRobotClay,
		geodeRobotOre,
		geodeRobotObsidian int
	)
	fmt.Sscanf(line,
		"Blueprint %d: Each ore robot costs %d ore. Each clay robot costs %d ore. Each obsidian robot costs %d ore and %d clay. Each geode robot costs %d ore and %d obsidian.",
		&res.id,
		&oreRobotOre,
		&clayRobotOre,
		&obsidianRobotOre,
		&obsidianRobotClay,
		&geodeRobotOre,
		&geodeRobotObsidian,
	)

	res.blueprint = map[Robot]map[Mineral]int{
		Robot(Ore):      map[Mineral]int{Ore: oreRobotOre},
		Robot(Clay):     map[Mineral]int{Ore: clayRobotOre},
		Robot(Obsidian): map[Mineral]int{Ore: obsidianRobotOre, Clay: obsidianRobotClay},
		Robot(Geode):    map[Mineral]int{Ore: geodeRobotOre, Obsidian: geodeRobotObsidian},
	}
	res.maxGeodes = 0

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

func dfsBreakGeodes(blueprint map[Robot]map[Mineral]int, oreInventory map[Mineral]int, robotInventory map[Robot]int, skipRobot []Robot, timeLeft int, maxGeodes *int) {
	// Exit condition
	if timeLeft <= 0 {
		if oreInventory[Geode] > *maxGeodes {
			*maxGeodes = oreInventory[Geode]
		}
		return
	}

	possibleConstructions := make([]Robot, 0)
	for r, ingredients := range blueprint {
		skip := false
		for _, skipR := range skipRobot {
			skip = skip || (r == skipR)
		}
		add := true
		for mineral, q := range ingredients {
			add = add && q <= oreInventory[mineral]
		}
		if !skip && add {
			possibleConstructions = append(possibleConstructions, r)
		}
	}

	// Collect resources from robots
	for r, q := range robotInventory {
		switch r {
		case Robot(Ore):
			oreInventory[Ore] += q
		case Robot(Clay):
			oreInventory[Clay] += q
		case Robot(Obsidian):
			oreInventory[Obsidian] += q
		case Robot(Geode):
			oreInventory[Geode] += q
		default:
			{
			}
		}
	}

	// Apply heuristics to reduce solution space

	// No need for more x-robots than max cost of x-mineral/robot
	maxOreRobot := map[Mineral]int{
		Ore:      0,
		Clay:     0,
		Obsidian: 0,
		Geode:    999,
	}
	for _, ingredients := range blueprint {
		for ing, q := range ingredients {
			if q > maxOreRobot[ing] {
				maxOreRobot[ing] = q
			}
		}
	}
	for mineral, max := range maxOreRobot {
		if max <= robotInventory[Robot(mineral)] {
			for i, r := range possibleConstructions {
				if r == Robot(mineral) {
					possibleConstructions = append(possibleConstructions[:i], possibleConstructions[i+1:]...)
				}
			}
		}
	}

	// If possible, only construct GeodeRobot
	onlyGeode := false
	for _, r := range possibleConstructions {
		if r == Robot(Geode) {
			possibleConstructions = []Robot{Robot(Geode)}
			onlyGeode = true
			break
		}
	}

	sort.Sort(sort.Reverse(Robots(possibleConstructions)))

	if !onlyGeode {
		if len(possibleConstructions) >= 2 {
			possibleConstructions = append(possibleConstructions[:2], Robot(None))
		} else {
			possibleConstructions = append(possibleConstructions, Robot(None))
		}
	}

	// PRune based on the maximum geode obtainable in the remaining time (limit is overestimated)
	if timeLeft*(robotInventory[Robot(Geode)]+(timeLeft-1))+oreInventory[Geode] <= *maxGeodes {
		return
	}

	for i := 0; i < len(possibleConstructions); i++ {
		newR := possibleConstructions[i]
		// Consume resources for newR
		newOreInventory := make(map[Mineral]int)
		for mineral, q := range oreInventory {
			newOreInventory[mineral] = q
		}
		for mineral, q := range blueprint[newR] {
			newOreInventory[mineral] -= q
		}

		// Enable newRobot
		newRobotInventory := make(map[Robot]int)
		for robot, q := range robotInventory {
			newRobotInventory[robot] = q
		}
		if newR != Robot(None) {
			newRobotInventory[newR] += 1
		}

		// Skip currently skipped robots if constructing None
		newSkipRobot := make([]Robot, 0)
		if newR == Robot(None) {
			for _, r := range skipRobot {
				if r != Robot(None) && int(r) < int(newR) {
					newSkipRobot = append(newSkipRobot, r)
				}
			}
			for _, skipR := range possibleConstructions {
				if skipR != newR {
					newSkipRobot = append(newSkipRobot, skipR)
				}
			}
		}

		// Recursion
		dfsBreakGeodes(blueprint, newOreInventory, newRobotInventory, newSkipRobot, timeLeft-1, maxGeodes)
	}
}

func part1(input []InputType) (result Part1Type) {
	sumQualityLevel := 0

	for _, b := range input {
		oreInventory := map[Mineral]int{
			Ore:      0,
			Clay:     0,
			Obsidian: 0,
			Geode:    0,
		}
		robotInventory := map[Robot]int{
			Robot(Ore):      1,
			Robot(Clay):     0,
			Robot(Obsidian): 0,
			Robot(Geode):    0,
		}

		dfsBreakGeodes(b.blueprint, oreInventory, robotInventory, []Robot{}, 24, &b.maxGeodes)

		sumQualityLevel += b.id * b.maxGeodes
	}

	result = Part1Type(sumQualityLevel)

	return
}

func part2(input []InputType, res1 Part1Type) (result Part2Type) {
	num := 1

	if len(input) >= 3 {
		input = input[:3]
	}

	for _, b := range input {
		oreInventory := map[Mineral]int{
			Ore:      0,
			Clay:     0,
			Obsidian: 0,
			Geode:    0,
		}
		robotInventory := map[Robot]int{
			Robot(Ore):      1,
			Robot(Clay):     0,
			Robot(Obsidian): 0,
			Robot(Geode):    0,
		}

		dfsBreakGeodes(b.blueprint, oreInventory, robotInventory, []Robot{}, 32, &b.maxGeodes)
		num *= b.maxGeodes
	}

	result = Part2Type(num)

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

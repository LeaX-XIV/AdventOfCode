// https://adventofcode.com/2022/day/7
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
type Type int
type Node struct {
	name     string
	size     uint
	typ      Type
	children []*Node
	parent   *Node
}
type InputType string

type Task struct {
	filename  string
	expected1 Part1Type
	expected2 Part2Type
	isTest    bool
}

const (
	dir Type = iota
	file
)

var tasks = []Task{
	{filename: "test1.txt", expected1: 95437, expected2: 24933642, isTest: true},
	{filename: "input.txt"},
}

func mapInputLine(line string) (InputType, error) {
	var res InputType

	res = InputType(line)

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

func newDir(name string, parent *Node) *Node {
	return &Node{
		name:     name,
		size:     0,
		typ:      dir,
		children: []*Node{},
		parent:   parent,
	}
}

func newFile(name string, size uint, parent *Node) *Node {
	return &Node{
		name:     name,
		size:     size,
		typ:      file,
		children: []*Node{},
		parent:   parent,
	}
}

func addSize(size uint, current *Node) {
	for current.parent != nil {
		current.parent.size += size
		current = current.parent
	}
}

func createTree(input []InputType, head *Node) {
	var current *Node = head
	for _, line := range input {
		var dirName string
		var fileName string
		var fileSize uint

		if string(line) == "$ ls" {
			continue
		}
		_, err := fmt.Sscanf(string(line), "$ cd %s", &dirName)
		if err == nil {
			if dirName == "/" {
				for current.parent != nil {
					current = current.parent
				}
			} else if dirName == ".." {
				current = current.parent
			} else {
				for _, child := range current.children {
					if child.name == dirName && child.typ == dir {
						current = child
						break
					}
				}
			}
			continue
		}
		_, err = fmt.Sscanf(string(line), "dir %s", &dirName)
		if err == nil {
			exists := false
			for _, child := range current.children {
				if child.typ == dir && child.name == dirName {
					exists = true
					break
				}
			}
			if !exists {
				current.children = append(current.children, newDir(dirName, current))
			}
			continue
		}
		_, err = fmt.Sscanf(string(line), "%d %s", &fileSize, &fileName)
		if err == nil {
			exists := false
			for _, child := range current.children {
				if child.typ == file && child.name == fileName {
					exists = true
					break
				}
			}
			if !exists {
				current.children = append(current.children, newFile(fileName, fileSize, current))
			}
			continue
		}
	}

	visitDfs(head, func(current *Node) bool {
		if current.typ == dir {
			return true
		}

		addSize(current.size, current)
		return true
	})
}

func visitDfs(head *Node, task func(*Node) bool) {
	if !task(head) {
		return
	}
	for _, child := range head.children {
		visitDfs(child, task)
	}
}

func part1(input []InputType) (result Part1Type) {
	head := newDir("/", nil)
	createTree(input, head)
	var sumSize uint = 0
	visitDfs(head, func(head *Node) bool {
		if head.typ != dir {
			return false
		}
		if head.size <= 100000 {
			sumSize += head.size
		}

		return true
	})

	result = Part1Type(sumSize)

	return
}

func part2(input []InputType, res1 Part1Type) (result Part2Type) {
	head := newDir("/", nil)
	createTree(input, head)

	var totalSize uint = 70000000
	var neededSize uint = 30000000
	availableSize := totalSize - head.size
	var minSize uint = math.MaxUint32

	visitDfs(head, func(head *Node) bool {
		if head.typ != dir {
			return false
		}
		if head.size+availableSize >= neededSize && head.size < minSize {
			minSize = head.size
		}

		return true
	})

	result = Part2Type(minSize)

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

#!python
# https://adventofcode.com/2019/day/11

from ICProgram import ICProgram as ICP

# 0 black   1 white
direction = {
	0: (0, -1),	# Up
	1: (1, 0),	# Right
	2: (0, 1),	#Down
	3: (-1, 0)	# Left
}

pointing = 0
position = (0, 0)
visitedCells = {(0, 0): 1}

lines = []
with open('input.txt', 'r') as f:
	lines = [int(c) for c in f.readlines()[0].strip().split(',')]

def turn(angle):
	global pointing
	# angle = 0: Turn left
	# angle = 1: Turn right
	pointing = (pointing + (1 if angle == 1 else -1)) % 4

def move():
	global position
	position = (position[0] + direction[pointing][0], position[1] + direction[pointing][1])


brain = ICP()
brain.loadProgram(lines)
brain.feedInput(visitedCells[position])
brain.start()
while(brain.waitForOutput()):
	newColor = brain.getOutput(True)
	visitedCells[position] = newColor
	angle = brain.getOutput(True)
	turn(angle)
	move()
	standingColor = visitedCells[position] if position in visitedCells.keys() else 0
	brain.feedInput(standingColor)
print(len(visitedCells.keys()))	# Part 1: 2539

minx = min(x for x, y in visitedCells.keys())
miny = min(y for x, y in visitedCells.keys())
maxx = max(x for x, y in visitedCells.keys())
maxy = max(y for x, y in visitedCells.keys())

grid = [[0 for x in range(maxx - minx + 1)] for y in range(maxy - miny + 1)]
for x, y in visitedCells.keys():
	color = visitedCells[x, y]
	x -= minx
	y -= miny
	grid[y][x] = color

for i in range(len(grid)):	# Part 2: ZLEBKJRA
	for j in range(len(grid[i])):
		if(grid[i][j] == 1):
			print('█', end='')
		elif(grid[i][j] == 0):
			print(' ', end='')
	print('')
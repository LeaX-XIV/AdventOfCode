#!python
# https://adventofcode.com/2019/day/15
from ICProgram import ICProgram as ICP

program = []
with open('input.txt', 'r') as f:
	program = [ int(c) for c in f.readlines()[0].strip().split(',') ]

def searchBreak(pos, steps, dirBack):
	for d in dirs.keys():
		if(d != dirBack):
			robot.feedInput(d)
			status = robot.getOutput()
			if(status == 0):	# Wall
				continue
			
			dPos = dirs[d]
			newPos = (pos[0] + dPos[0], pos[1] + dPos[1])
			if(status == 2):
				return steps + 1
			back = 2 if d == 1 else 1 if d == 2 else 3 if d == 4 else 4
			if(newPos in area):
				robot.feedInput(back)
				robot.getOutput()	# 1
				continue
			area[newPos] = steps + 1
			if(s := searchBreak(newPos, steps + 1, back)):
				return s
	# Dead end
	robot.feedInput(dirBack)
	robot.getOutput()	# 1
	return False

def explore(pos, dirBack):
	for d in dirs.keys():
		if(d != dirBack):
			robot.feedInput(d)
			status = robot.getOutput()

			dPos = dirs[d]
			newPos = (pos[0] + dPos[0], pos[1] + dPos[1])
			back = 2 if d == 1 else 1 if d == 2 else 3 if d == 4 else 4
			if(newPos in area and status != 0):
				robot.feedInput(back)
				robot.getOutput()	# 1
				continue
			area[newPos] = status
			if(status == 0):	# Wall
				continue
			explore(newPos, back)
	# Dead end
	if(dirBack is not None):
		robot.feedInput(dirBack)
		robot.getOutput()	# 1
	return

def getFreeAdj(m, x, y):
	adj = []
	for d in dirs.values():
		try:
			if(m[y + d[1]][x + d[0]] == 1):
				adj.append((x + d[0], y + d[1]))
		except IndexError:
			continue
	return adj


dirs = {
	1: (-1, 0),	# North
	2: (1, 0),	# South
	3: (0, -1),	# West
	4: (0, 1)	# East
}
pos = (0, 0)
steps = 0
area = {pos: steps}

robot = ICP()
robot.loadProgram(program)
robot.start()
if(s := searchBreak(pos, steps, None)):
	print(s)	# Part 1: 246
robot.stop()

area = {pos: 1}
robot = ICP()
robot.loadProgram(program)
robot.start()
explore(pos, None)

minX = min(x for x, y in area.keys())
maxX = max(x for x, y in area.keys())
minY = min(y for x, y in area.keys())
maxY = max(y for x, y in area.keys())

grid = [[ -1 for x in range(maxX - minX + 1)] for y in range(maxY - minY + 1)]
for x, y in area.keys():
	grid[y - minY][x - minX] = area[x, y]

minute = 0
while(1):
	oxExpandsTo = []
	for y in range(len(grid)):
		for x in range(len(grid[y])):
			if(grid[y][x] == 2):
				oxExpandsTo.extend(getFreeAdj(grid, x, y))
	if(len(oxExpandsTo) == 0):
		break
	for x, y in oxExpandsTo:
		grid[y][x] = 2
	oxExpandsTo = []
	minute += 1
print(minute)	# Part 2: 376
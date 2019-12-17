#!python
# https://adventofcode.com/2019/day/17
from ICProgram import ICProgram as ICP

dirs = {
	1: (-1, 0),
	2: (0, 1),
	3: (1, 0),
	4: (0, -1)
}

def isIntersection(grid, x, y):
	if(grid[y][x] == 35):
		for d in dirs.values():
			dx, dy = d
			try:
				if(grid[y + dy][x + dx] != 35):
					return False
			except IndexError:
				return False
		return True
	return False

def alignParam(x, y):
	return x * y


program = []
with open('input.txt', 'r') as f:
	program = f.readlines()[0].strip().split(',')

grid = [[46 for x in range(77)] for y in range(41)]
robot = ICP()
robot.loadProgram(program)
robot.start()
x, y = 0, 0
while(robot.waitForOutput()):
	# print(chr(robot.getOutput()), end='')
	c = robot.getOutput()
	if(c == 10):
		y += 1
		x = 0
	else:
		grid[y][x] = c
		x += 1

acc = 0
for y in range(len(grid)):
	for x in range(len(grid[y])):
		if(isIntersection(grid, x, y)):
			acc += alignParam(x, y)

print(acc)	# Part 1: 8408

program[0] = 2
robot.loadProgram(program)

# Computed by hand
mainRoutine = 'A,B,A,C,B,C,A,B,A,C'
funcA = 'R,6,L,10,R,8,R,8'
funcB = 'R,12,L,8,L,10'
funcC = 'R,12,L,10,R,6,L,10'
robot.start()

assert len(mainRoutine) < 20
assert len(funcA) < 20
assert len(funcB) < 20
assert len(funcC) < 20

for c in mainRoutine:
	robot.feedInput(ord(c))
robot.feedInput(10)
for c in funcA:
	robot.feedInput(ord(c))
robot.feedInput(10)
for c in funcB:
	robot.feedInput(ord(c))
robot.feedInput(10)
for c in funcC:
	robot.feedInput(ord(c))
robot.feedInput(10)

robot.feedInput(ord('n'))
robot.feedInput(10)

while(robot.waitForOutput()):
	try:
		# print(chr(c := robot.getOutput()), end='')
		chr(c := robot.getOutput())
	except ValueError:
		print(c)	# Part 2: 1168948
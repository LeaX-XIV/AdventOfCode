#!python
# https://adventofcode.com/2019/day/19
from ICProgram import ICProgram as ICP

def inspectCoord(x, y):
	drone.start()
	drone.feedInput(x)
	drone.feedInput(y)
	a = drone.getOutput()
	drone.stop()
	return a

program = []
with open('input.txt', 'r') as f:
	program = f.readlines()[0].strip().split(',')

drone = ICP()
drone.loadProgram(program)
affected = 0
for y in range(50):
	for x in range(50):
		a = inspectCoord(x, y)
		# print(a, end='')
		affected += a
	# print('')

print(affected) # Part 1: 171

x, y = 0, 10

while(1):
	while(inspectCoord(x, y) == 0):
		x += 1

	if(inspectCoord(x, y - 99) == 1 and inspectCoord(x + 99, y - 99) == 1):
		print((x * 10000 + y - 99))	# Part 2: 9741242
		break

	y += 1
	x -= 1
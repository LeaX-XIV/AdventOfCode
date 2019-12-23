#!python
# https://adventofcode.com/2019/day/23
from ICProgram import ICProgram as ICP
import sys

nat = None
listY = []

program = []
with open('input.txt', 'r') as f:
	program = f.readlines()[0].strip().split(',')

computers = []
for i in range(50):
	c = ICP()
	c.loadProgram(program)
	c.feedInput(i)
	computers.append(c)

for c in computers:
	c.start()

while(1):
	netIdle = True
	for i in range(len(computers)):
		c = computers[i]
		netIdle &= c.isIdle()
		if(dest := c.getOutput(False)):
			X = c.getOutput()
			Y = c.getOutput()
			# print('From {} to {} X={} Y={}'.format(i, dest, X, Y))

			if(dest == 255):
				if(len(listY) == 0):
					print(Y)	# Part 1: 23954
				nat = (X, Y)
			else:
				computers[dest].feedInput(X)
				computers[dest].feedInput(Y)
	
	if(nat is not None and netIdle):
		for c in computers:
			c.resetIdle()
		# print('Idle, sending to 0 X={}, Y={}'.format(nat[0], nat[1]))
		computers[0].feedInput(nat[0])
		computers[0].feedInput(nat[1])
		if(nat[1] in listY):
			print(nat[1])	# Part 2: 17265
			sys.exit(0)
		listY.append(nat[1])
		nat = None

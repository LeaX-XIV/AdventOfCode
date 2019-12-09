#!python
# https://adventofcode.com/2019/day/9

from ICProgram import ICProgram as ICP

lines = []
with open('input.txt', 'r') as f:
	lines = f.readlines()


program = [int(c) for c in lines[0].split(',')]

machine = ICP()
machine.loadProgram(program)
machine.feedInput(1)
machine.start()
while(machine.waitForOutput()):
	print(machine.getOutput(True))	# Part 1: 2775723069

machine.stop()
machine.feedInput(2)
machine.start()
while(machine.waitForOutput()):
	print(machine.getOutput(True))	# Part 2: 49115
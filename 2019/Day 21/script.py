#!python
# https://adventofcode.com/2019/day/21
from ICProgram import ICProgram as ICP

program = []
with open('input.txt', 'r') as f:
	program = f.readlines()[0].strip().split(',')
springdroid = ICP()
springdroid.loadProgram(program)
springdroid.start()
commandWalk = \
'''NOT A J
NOT C T
AND D T
OR T J
NOT B T
AND D T
OR T J
WALK
'''
for c in commandWalk:
	springdroid.feedInput(ord(c))
while(springdroid.waitForOutput()):
	try:
		print(chr(c := (springdroid.getOutput())), end='')
	except:
		print(c)	# Part 1: 19357507
springdroid.stop()
springdroid.start()
commandRun = \
'''NOT C T
NOT B J
OR T J
NOT A T
OR T J
AND D J
AND H J
NOT A T
OR T J
RUN
'''
for c in commandRun:
	springdroid.feedInput(ord(c))
while(springdroid.waitForOutput()):
	try:
		print(chr(c := (springdroid.getOutput())), end='')
	except:
		print(c)	# Part 2: 1142830249

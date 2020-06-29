#!python
# https://adventofcode.com/2019/day/25
from ICProgram import ICProgram as ICP
from threading import Thread

def listen(icp):
	while(icp.waitForOutput()):
		print(chr(icp.getOutput()), end='')

program = []
with open('input.txt', 'r') as f:
	program = f.readlines()[0].strip().split(',')

droid = ICP()
droid.loadProgram(program)
droid.start()

Thread(target=listen, args=(droid,), daemon=True).start()

while(1):
	for c in input():
		droid.feedInput(ord(c))
	droid.feedInput(10)

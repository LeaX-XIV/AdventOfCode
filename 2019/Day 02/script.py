#!python
# https://adventofcode.com/2019/day/2

import sys, traceback

memory = []
pc = 0
def reset():
	global memory
	global pc
	memory = []
	pc = 0
	with open('input.txt', 'r') as f:
		memory = f.readline().split(',')


def clockCycle():
	global pc
	opcode = int(memory[pc])
	op1 = int(memory[pc+1])
	op2 = int(memory[pc+2])
	dst = int(memory[pc+3])

	if(opcode == 1):	# Add
		memory[dst] = int(memory[op1]) + int(memory[op2])
	elif(opcode == 2):	# Multiply
		memory[dst] = int(memory[op1]) * int(memory[op2])
	elif(opcode == 99):	# Halt
		return False

	pc += 4
	return True

def main():
	reset()
	memory[1] = 12
	memory[2] = 2
	while(clockCycle()):
		pass
	print(memory[0])	# Part 1: 6730673

	for noun in range(100):
		for verb in range(100):
			reset()
			memory[1] = noun
			memory[2] = verb
			while(clockCycle()):
				pass
			if(memory[0] == 19690720):
				print(100 * noun + verb)	# Part 2: 3749
				return


if __name__ == "__main__":
    main()
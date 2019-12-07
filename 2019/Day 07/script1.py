#!python
# https://adventofcode.com/2019/day/7

import itertools as it

memory = []
pc = 0
output = 0
maxPower = 0
def reset():
	global memory
	global pc
	memory = []
	pc = 0
	with open('input.txt', 'r') as f:
		memory = [int(c) for c in f.readline().split(',')]


def readModes(opcode):
	modes = [0, 0, 0, 0]
	
	modes[3] = opcode % 100
	modes[2] = (opcode // 100) % 10
	modes[1] = (opcode // 1000) % 10
	modes[0] = opcode // 10000

	return tuple(modes)


def clockCycle(id):
	global pc
	global output
	opcode = memory[pc]
	m3, m2, m1, op = readModes(opcode)
	if(opcode == 99):	# Halt
		return False
	
	pc += 1

	if(op == 1 or op == 2 or op == 7 or op == 8):	# 3 args
		op1 = memory[pc]
		pc += 1
		if(m1 == 0):
			op1 = memory[op1]

		op2 = memory[pc]
		pc += 1
		if(m2 == 0):
			op2 = memory[op2]

		dst = memory[pc]
		pc += 1
		if(m3 == 1):
			print('Error')
			return False

		if(op == 1): # Add
			memory[dst] = op1 + op2
		elif(op == 2):	# Multiply
			memory[dst] = op1 * op2
		elif(op == 7):	# Less than
			memory[dst] = 0
			if(op1 < op2):
				memory[dst] = 1
		elif(op == 8):	# Equals
			memory[dst] = 0
			if(op1 == op2):
				memory[dst] = 1

	elif(op == 5 or op == 6):	# 2 args
		op1 = memory[pc]
		pc += 1
		if(m1 == 0):
			op1 = memory[op1]

		op2 = memory[pc]
		pc += 1
		if(m2 == 0):
			op2 = memory[op2]
		
		if(op == 5):	# Jump if True
			if(op1 != 0):
				pc = op2
		elif(op == 6):	# Jump if False
			if(op1 == 0):
				pc = op2
			
	elif(op == 3):	# Input
		dst = memory[pc]
		pc += 1
		if(m3 == 1):
			print('Error')
			return False

		# value = int(input())
		value = id
		memory[dst] = value
			
	elif(opcode == 4):	# Output
		op1 = memory[pc]
		pc += 1
		if(m1 == 0):
			op1 = memory[op1]
		output = op1

	return True

def main():
	global output
	global maxPower

	for seq in it.permutations(range(5)):
		output = 0
		for phase in seq:
			reset()
			clockCycle(int(phase))
			while(clockCycle(output)):
				pass
		if(maxPower < output):
			maxPower = output 
	
	print(maxPower)	# Part 1: 366376


if __name__ == "__main__":
    main()
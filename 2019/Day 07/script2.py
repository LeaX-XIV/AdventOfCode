#!python
# https://adventofcode.com/2019/day/7

import itertools as it

memory = [[]] * 5
pc = [0] * 5
output = 0
maxPower = 0
def reset():
	global memory
	global pc
	global output
	memory = [[]] * 5
	pc = [0] * 5
	output = 0
	with open('input.txt', 'r') as f:
		memory[0] = [int(c) for c in f.readline().split(',')]
		memory[1] = memory[0].copy()
		memory[2] = memory[0].copy()
		memory[3] = memory[0].copy()
		memory[4] = memory[0].copy()


def readModes(opcode):
	modes = [0, 0, 0, 0]

	modes[3] = opcode % 100
	modes[2] = (opcode // 100) % 10
	modes[1] = (opcode // 1000) % 10
	modes[0] = opcode // 10000

	return tuple(modes)


def clockCycle(id, index):
	global pc
	global output
	
	opcode = memory[index][pc[index]]
	m3, m2, m1, op = readModes(opcode)
	if(opcode == 99):	# Halt
		return False
	
	pc[index] += 1

	if(op == 1 or op == 2 or op == 7 or op == 8):	# 3 args
		op1 = memory[index][pc[index]]
		pc[index] += 1
		if(m1 == 0):
			op1 = memory[index][op1]

		op2 = memory[index][pc[index]]
		pc[index] += 1
		if(m2 == 0):
			op2 = memory[index][op2]

		dst = memory[index][pc[index]]
		pc[index] += 1
		if(m3 == 1):
			print('Error')
			return False

		if(op == 1): # Add
			memory[index][dst] = op1 + op2
		elif(op == 2):	# Multiply
			memory[index][dst] = op1 * op2
		elif(op == 7):	# Less than
			memory[index][dst] = 0
			if(op1 < op2):
				memory[index][dst] = 1
		elif(op == 8):	# Equals
			memory[index][dst] = 0
			if(op1 == op2):
				memory[index][dst] = 1

	elif(op == 5 or op == 6):	# 2 args
		op1 = memory[index][pc[index]]
		pc[index] += 1
		if(m1 == 0):
			op1 = memory[index][op1]

		op2 = memory[index][pc[index]]
		pc[index] += 1
		if(m2 == 0):
			op2 = memory[index][op2]
		
		if(op == 5):	# Jump if True
			if(op1 != 0):
				pc[index] = op2
		elif(op == 6):	# Jump if False
			if(op1 == 0):
				pc[index] = op2
			
	elif(op == 3):	# Input
		dst = memory[index][pc[index]]
		pc[index] += 1
		if(m3 == 1):
			print('Error')
			return False

		# value = int(input())
		value = id
		memory[index][dst] = value
			
	elif(opcode == 4):	# Output
		op1 = memory[index][pc[index]]
		pc[index] += 1
		if(m1 == 0):
			op1 = memory[index][op1]
		output = op1
		return False

	return True

def main():
	global output
	global maxPower


	for seq in it.permutations(range(5, 10)):
		index = 0
		output = 0
		reset()
		while(True):
			if(index < 5):
				phase = seq[index]
				clockCycle(int(phase), index)
			while(clockCycle(output, (index % 5))):
				pass
			if(index%5 == 4 and memory[index%5][pc[index%5]] == 99):
				break
			index += 1
		if(maxPower < output):
			maxPower = output 
		
	print(maxPower)	# Part 2: 21596786




if __name__ == "__main__":
    main()
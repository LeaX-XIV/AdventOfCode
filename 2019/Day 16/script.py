#!python
# https://adventofcode.com/2019/day/16

lines = []
with open('input.txt', 'r') as f:
	lines = f.readlines()

pattern = [0, 1, 0, -1]
input = [int(c) for c in lines[0]]
output = [0] * len(input)		

for phase in range(1, 101):
	for do in range(1, len(input) + 1):
		acc = [0, 0, 0, 0]
		for i in range(len(input)):
			index = ((i + 1) // (do)) % 4
			if(index != 0 and index != 2):
				acc[index] += input[i] * pattern[index]
		output[do - 1] = int(str(sum(acc))[-1])
	input = output
print(''.join(map(str, output[:8])))	# Part 1: 29795507

input = [int(c) for c in lines[0]]
offset = int(lines[0][:7])
input = [input[i % len(input)] for i in range(offset, len(input) * 10000)]

for phase in range(1, 101):
	for i in reversed(range(1, len(input))):
		input[i - 1] += input[i]
	for i in range(len(input)):
		input[i] = input[i] % 10
		
print(''.join(map(str, input[:8])))	# Part 2: 89568529
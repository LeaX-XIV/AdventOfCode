#!python
# https://adventofcode.com/2019/day/8

w = 25
h = 6

line = ''
with open('input.txt', 'r') as f:
	line = f.readlines()[0].strip()

min0 = None
min0Index = -1
for i in range(0, len(line), w * h):
	count0 = line.count('0', i, i + w * h)
	if(min0 is None or min0 > count0):
		min0 = count0
		min0Index = i

num1 = line.count('1', min0Index, min0Index + w * h)
num2 = line.count('2', min0Index, min0Index + w * h)

print(num1 * num2)	# Part 1: 1206

image = [[2 for i in range(w)] for j in range(h)]
for index in range(w * h):
	i = index // w
	j = index % w

	for k in range(index, len(line), w * h):
		if(line[k] == '0' or line[k] == '1'):
			image[i][j] = line[k]
			break

for i in range(h):	# Part 2: EJRGP
	for j in range(w):
		if(image[i][j] == '1'):
			print(0, end='')
		elif(image[i][j] == '0'):
			print(' ', end='')
	print('')
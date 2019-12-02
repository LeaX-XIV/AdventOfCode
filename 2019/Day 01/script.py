#!python
# https://adventofcode.com/2019/day/1

from functools import reduce
from itertools import starmap

lines = []
with open('input.txt', 'r') as f:
	lines = f.readlines()

fuel = map(lambda s: int(int(s) / 3) - 2, lines)
fuelSum = reduce(lambda x, y: x + y, fuel, 0)
print(fuelSum)	# Part 1: 3305301

def compute(s):
	a = [(int(int(s) / 3) - 2)]

	while(a[-1] > 0):
		a.append((int(int(a[-1]) / 3) - 2))

	del a[-1]
	return sum(a)

fuel = map(compute, lines)
fuelSum = reduce(lambda x, y: x + y, fuel, 0)
print(fuelSum)	# Part 2: 4955106
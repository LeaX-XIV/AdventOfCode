#!python
# https://adventofcode.com/2019/day/24
from copy import deepcopy

dirs = (
	(1, 0),
	(0, 1),
	(-1, 0),
	(0, -1)
)

def getAdjCount(g, i, j):
	count = 0

	for d in dirs:
		x = j + d[0]
		y = i + d[1]
		if(x < 0 or y < 0):
			continue
		try:
			if(g[y][x] == '#'):
				count += 1
		except IndexError:
			continue
	
	return count

def biodivRating(g):
	rating = 0
	for i in range(len(g)):
		for j in range(len(g[i])):
			if(g[i][j] == '#'):
				rating += 1 << (i * len(g[i]) + j)
	
	return rating

assert biodivRating([['.','.','.','.','.'],['.','.','.','.','.'],['.','.','.','.','.'],['#','.','.','.','.'],['.','#','.','.','.']]) == 2129920

grid = []
with open('input.txt', 'r') as f:
	grid = [list(l.strip()) for l in f.readlines()]

pStates = [grid]
nextMinute = [['.' for _ in range(len(grid[0]))] for _ in range(len(grid))]
minute = 0

while(1):
	for i in range(len(grid)):
		for j in range(len(grid[i])):
			if(grid[i][j] == '#' and getAdjCount(grid, i, j) != 1):
				# Bug dies
				nextMinute[i][j] = '.'
			elif(grid[i][j] == '.' and getAdjCount(grid, i, j) in (1, 2)):
				# Infested
				nextMinute[i][j] = '#'
			else:
				nextMinute[i][j] = grid[i][j]

	if(nextMinute in pStates):
		print(biodivRating(nextMinute), minute)	# Part 1: 18844281 
		break

	pStates.append(deepcopy(nextMinute))
	grid = [[nextMinute[i][j] for j in range(len(nextMinute[i]))] for i in range(len(nextMinute))]
	minute += 1
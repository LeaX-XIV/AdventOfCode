#!python
# https://adventofcode.com/2019/day/18

from itertools import permutations
from functools import reduce

def go(m, start, end):
	for y in range(len(m)):
		for x in range(len(m[y])):
			if(m[y][x] == start):
				return searchBreak(m, (x, y), 0, (), end, None)
	


def searchBreak(m, pos, steps, doors, stop, dirBack):
	for d in dirs.keys():
		if(d != dirBack):
			dPos = dirs[d]
			newPos = (pos[0] + dPos[0], pos[1] + dPos[1])
			try:
				find = m[newPos[1]][newPos[0]]
			except IndexError:
				continue

			if(find == '#'):	# Wall
				continue
			if(find.isupper()):	# Door
				door = [find]
				door.extend(doors)
				doors = tuple(door)
			if(find == stop):	# Arrived
				return (steps + 1, doors)
			back = 2 if d == 1 else 1 if d == 2 else 3 if d == 4 else 4
			# if(newPos in area):
			# 	robot.feedInput(back)
			# 	robot.getOutput()	# 1
			# 	continue
			# area[newPos] = steps + 1
			if(s := searchBreak(m, newPos, steps + 1, doors, stop, back)):
				return s
	# Dead end
	# robot.feedInput(dirBack)
	# robot.getOutput()	# 1
	return False

dirs = {
	1: (0, -1),	# North
	4: (1, 0),	# East
	2: (0, 1),	# South
	3: (-1, 0),	# West
}

grid = []
with open('test.txt', 'r') as f:
	grid = [l.strip() for l in f.readlines()]

waypoints = list(filter(lambda c: c != '.' and c != '#' and c.islower(), ''.join(grid)))
# print(grid)
conn = {}

for p in permutations(waypoints, 2):
	start, end = p
	steps, doors = go(grid, start, end)
	conn[start, end] = {
		'steps': steps,
		'doors': doors
	}
print(1)

for w in waypoints:
	start = '@'
	end = w
	steps, doors = go(grid, start, end)
	conn[start, end] = {
		'steps': steps,
		'doors': doors
	}
print(2)

minSteps = len(grid) ** len(grid)
bestP = None
for p in permutations(waypoints):
	t = ['@']
	t.extend(p)
	# print(t)

	steps = 0
	possible = True
	for i in range(1, len(t)):
		start = t[i - 1]
		end = t[i]

		s, d = conn[start, end].values()
		steps += s
		# possible &= reduce(lambda x, j: x and (d[j] in p[:i]), range(len(d)), True)
		for j in range(len(d)):
			possible &= d[j].lower() in p[:i]
		if(not possible):
			break
			
	if(possible):
		if(steps < minSteps):
			minSteps = steps
			bestP = p

print(minSteps)
print(bestP)









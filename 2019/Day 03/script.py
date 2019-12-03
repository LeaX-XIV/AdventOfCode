#!python
# https://adventofcode.com/2019/day/3

def dist(c1, c2, x, y):
	return abs(c1 - x) + abs(c2 - y)
def key(x, y):
	return str(x) + '-' + str(y)


lines = []
with open('input.txt', 'r') as f:
	lines = f.readlines()

grid = []
for i in range(20000):
	grid.append(['.']*20000)

dirs = (lines[0].split(','), lines[1].split(','))

intersections = {}
center = [10000, 6000]
for wire in range(len(dirs)):
	now = [10000, 6000]
	for i in dirs[wire]:
		direction = i[0]
		value = int(i[1:])

		for step in range(value):
			if(direction == 'U'):
				now[1] -= 1
			elif(direction == 'D'):
				now[1] += 1
			elif(direction == 'R'):
				now[0] += 1
			elif(direction == 'L'):
				now[0] -= 1


			# print(now)

			if(grid[now[0]][now[1]] == '.' or grid[now[0]][now[1]] == wire):
				grid[now[0]][now[1]] = wire
			else:
				grid[now[0]][now[1]] = 'X'
				intersections[key(now[0], now[1])] = False

minD = 20000
for k in intersections.keys():
	(x, y) = k.split('-')
	d = dist(center[0], center[1], int(x), int(y))
	if(d < minD):
		minD = d

print(minD)	# Part 1: 1064

tmp = (intersections.copy(), intersections.copy())

for wire in range(len(dirs)):
	total = 0
	now = [10000, 6000]
	for i in range(len(dirs[wire])):
		direction = dirs[wire][i][0]
		value = int(dirs[wire][i][1:])

		for step in range(value):
			total += 1
			if(direction == 'U'):
				now[1] -= 1
			elif(direction == 'D'):
				now[1] += 1
			elif(direction == 'R'):
				now[0] += 1
			elif(direction == 'L'):
				now[0] -= 1

			if((key(now[0], now[1])) in tmp[wire].keys()):
				if(tmp[wire][key(now[0], now[1])] == False):
					tmp[wire][key(now[0], now[1])] = total


for k in tmp[0].keys():
	tmp[0][k] += tmp[1][k]

minS = 9999999999999999
for k in tmp[0].keys():
	s = tmp[0][k]
	if(s < minS):
		minS = s
print(minS)	# Part 2: 25676


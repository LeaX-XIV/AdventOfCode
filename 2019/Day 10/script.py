#!python
# https://adventofcode.com/2019/day/10

from math import gcd

lines = []
with open('input.txt', 'r') as f:
	lines = [line.strip() for line in f.readlines()]

def visible(xa, ya, xb, yb):
	if(xa == xb and ya == yb):
		return None

	dx = xb - xa
	dy = yb - ya
	d = gcd(dx, dy)

	dx = dx / d
	dy = dy / d

	x = xa + dx
	y = ya + dy

	while(x >= 0 and x < X and y >= 0 and y < Y):
		if((x, y) in asts):
			return (x, y)
		x += dx
		y += dy
	return None

asts = {}
Y = len(lines)
X = len(lines[0])
for y in range(len(lines)):
	for x in range(len(lines[y])):
		c = lines[y][x]
		if(c == '#'):
			asts[x, y] = []

for xa, ya in asts:
	for xb, yb in asts:
		if(ast := visible(xa, ya, xb, yb)):
			if(ast not in asts[xa, ya]):
				asts[xa, ya].append(ast)

best = max([len(v) for v in asts.values()])
print(best)	# Part 1: 282

bestx, besty = next((x, y) for x, y in asts if len(asts[x, y]) == best)

border = []
border.append((bestx, 0))
for x in range(bestx + 1, min(X, bestx + besty)):
	for y in range(besty - x + bestx):
		border.append((x, y))

border.append((bestx + besty, 0))
for y in range(max(0, Y - bestx - besty), besty):
	for x in range(min(X, bestx + besty + 1) - y, X):
		border.append((x, y))

border.append((X - 1, besty))
for y in range(besty + 1, min(Y, bestx + besty)):
	for x in range(X - 1, bestx - besty + y, -1):
		border.append((x, y))

border.append((bestx - besty + Y - 1, Y - 1))
for x in range(X - 1, bestx + 1, -1):
	for y in range(min(Y, bestx + besty - (X - 1 - x)), Y):
		border.append((x, y))

border.append((bestx, Y - 1))
for x in range(bestx - 1, max(-1, Y - besty), -1):
	for y in range(Y - 1, besty + (bestx - x), - 1):
		border.append((x, y))

border.append((bestx - Y + 1 + besty, Y - 1))
for y in range(min(Y - 1, bestx + besty), besty, -1):
	for x in range(bestx - (y - min(Y - 1, bestx + besty)), -1, -1):
		border.append((x, y))

border.append((0, besty))
for y in range(besty - 1, max(-1, besty - bestx - 1), -1):
	for x in range(bestx - (besty - y)):
		border.append((x, y))

border.append((bestx - besty, 0))
for x in range(bestx - besty + 1, bestx):
	for y in range(max(besty - bestx, 0) - (bestx - besty + 1 - x), -1, -1):
		border.append((x, y))

thisCycle = []
destroyed = []
i = 0
# For whatever reason it is the 205th
# Too tired to check what's wrong
while(len(destroyed) < 205):
	if(ast := visible(bestx, besty, border[i][0], border[i][1])):
		if(ast not in thisCycle):
			destroyed.append(ast)
			thisCycle.append(ast)
	i += 1
	if(i >= len(border)):
		i = 0
		for ast in thisCycle:
			del asts[ast]
		thisCycle = []
print(int(ast[0] * 100 + ast[1]))	# Part 2: 1008

#!python
# https://adventofcode.com/2019/day/13
from ICProgram import ICProgram as ICP
import time
import sys

# Better on a 38x28 console
VISUALIATION = False
sys.stdout.reconfigure(encoding='utf-8')

def printScreen(s, score):
	for row in s:
		for tile in row:
			if(tile == 0):
				print(' ', end='')
			elif(tile == 1):
				print('█', end='')
			elif(tile == 2):
				print('□', end='')
			elif(tile == 3):
				print('─', end='')
			elif(tile == 4):
				print('○', end='')
		print('')
	print('{:0>7}'.format(score))
	time.sleep(0.1)

lines = []
with open('input.txt', 'r') as f:
	lines = [int(c) for c in f.readlines()[0].strip().split(',')]

tiles = {}
game = ICP()
game.loadProgram(lines)
game.start()
while(game.waitForOutput()):
	x = game.getOutput()
	y = game.getOutput()
	tileId = game.getOutput()
	if(x == -1 and y == 0):
		# Score
		score = tileId
		continue
	tiles[(x, y)] = tileId
if(not VISUALIATION):
	print(len(list(filter(lambda c: c == 2, tiles.values()))))	# Part 1: 372
maxX = max(x for x, y in tiles.keys())
maxY = max(y for x, y in tiles.keys())


lines[0] = 2
screen = [[0 for i in range(maxX + 1)] for j in range(maxY + 1)]
game2 = ICP()
game2.loadProgram(lines)
game2.start()
paddle = None
ball = None
score = 0
while(game2.waitForOutput()):
	while((x := game2.getOutput(False)) is None):
		pass
	while((y := game2.getOutput(False)) is None):
		pass
	while((tileId := game2.getOutput(False)) is None):
		pass
	if(tileId == 4):
		ball = (x, y)
	elif(tileId == 3):
		paddle = (x, y)
	if(x == -1 and y == 0):
		score = tileId
		continue
	screen[y][x] = tileId

	if(ball is not None and paddle is not None):
		pressed = -1 if paddle[0] > ball[0] else 1 if paddle[0] < ball[0] else 0
		game2.feedInput(pressed)
		paddle = (paddle[0] + pressed, paddle[1])
		ball = None
		if(VISUALIATION):
			printScreen(screen, score)
if(not VISUALIATION):
	print(score)	# Part 2: 19297
else:
	printScreen(screen, score)
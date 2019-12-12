#!python
# https://adventofcode.com/2019/day/12

import re
from moon import Moon
from math import gcd

def lcm(x, y, z):
	v1 = x * y // gcd(x, y)
	return v1 * z // gcd(v1, z)

pattern = '<x=(-?\\d+), y=(-?\\d+), z=(-?\\d+)>'

lines = []
moons = []
states = [{}, {}, {}]
t = 0
with open('input.txt', 'r') as f:
	lines = f.readlines()

for line in lines:
	regex = re.compile(pattern)
	if(m := regex.match(line)):
		moons.append(Moon(m.group(1), m.group(2), m.group(3)))

cycles = [-1, -1, -1]

while(cycles[0] < 0 or cycles[1] < 0 or cycles[2] < 0):
	if(t == 1000):
		print(sum([m.totEnergy() for m in moons]))	# Part 1: 9743
	
	for i in range(len(cycles)):
		if(cycles[i] < 0):
			key = (moons[0].pos[i], moons[0].vel[i], \
				moons[1].pos[i], moons[1].vel[i], \
				moons[2].pos[i], moons[2].vel[i], \
				moons[3].pos[i], moons[3].vel[i])
			if(key not in states[i]):
				states[i][key] = t
			else:
				cycles[i] = t

	for i in range(len(moons)):
		for j in range(i + 1, len(moons)):
			moons[i].applyGravity(moons[j])
			moons[j].applyGravity(moons[i])
	for m in moons:
		m.update()
	t += 1

print(lcm(cycles[0], cycles[1], cycles[2]))	# Part 2: 288684633706728
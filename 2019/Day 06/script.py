#!python
# https://adventofcode.com/2019/day/6

import re

def badTreeSearch(tag, level):
	for o in orbits.keys():
		if(tag in orbits[o].keys()):
			level = badTreeSearch(o, level+1)
			break
	return level

def getAncestors(tag):
	a = []
	for o in orbits.keys():
		if(tag in orbits[o].keys()):
			a.append(o)
			a.extend(getAncestors(o))
	return a

def getFirstCommon(a1, a2):
	for i1 in a1:
		for i2 in a2:
			if(i1 == i2):
				return i1
	return None


lines = []
with open('input.txt', 'r') as f:
	lines = f.readlines()

pattern = re.compile('(.+?)\\)(.+?)$')
orbits = {}
checksum = 0

for l in lines:
	if(m := pattern.match(l)):
		inner = m.group(1)
		outer = m.group(2)

		if(inner not in orbits.keys()):
			orbits[inner] = {}
		if(outer not in orbits.keys()):
			orbits[outer] = {}
		orbits[inner][outer] = True


checksum = sum([ badTreeSearch(o, 0) for o in orbits.keys() ])

print(checksum)	# Part 1: 162816

you = getAncestors('YOU')
san = getAncestors('SAN')
common = getFirstCommon(you, san)
print(you.index(common)+san.index(common))	# Part 2: 304
#!python
# https://adventofcode.com/2019/day/4

import re

pattern1 = re.compile('\\d*?(\\d)\\1\\d*')
pattern2 = re.compile('(\\d*?)(\\d)\\2{2,}(\\d*)')

def check(n):
	maybe = True
	s = str(n)
	
	if(pattern1.match(s) is not None):
		for j in range(len(s) - 1):
			(d1, d2) = (s[j], s[j+1])
			if(int(d1) > int(d2)):
				maybe = False
	else:
		maybe = False
	return maybe

def removeLargeGroups(n):
	s = str(n)
	while(m := pattern2.match(s)):
		s = m.group(1) + m.group(3)
	return s
	# occ = 0
	# p = None
	# reduced = []
	# s = str(n)
	# for i in s:
	# 	if(p == i):
	# 		occ += 1
	# 	else:
	# 		if(occ < 3):
	# 			for _ in range(occ):
	# 				reduced.append(p)
	# 		occ = 1
	# 	p = i

	# if(occ < 3):
	# 	for _ in range(occ):
	# 		reduced.append(i)

	# return ''.join(reduced)
		
lines = []
with open('input.txt', 'r') as f:
	lines = f.readlines()

(m, M) = lines[0].split('-')
num1 = 0
num2 = 0

for i in range(int(m), int(M)):
	if(check(i)):
		num1 += 1
		reduced = removeLargeGroups(i)
		if(check(reduced)):
			num2 += 1

print(num1)	# Part 1: 1330
print(num2)	# Part 2: 876
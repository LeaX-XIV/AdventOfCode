#!python
# https://adventofcode.com/2019/day/22
import re

def newStack(a):
	return list(reversed(a))

def cut(a, N):
	return list(a[N:] + a[:N])

def increment(a, N):
	table = a.copy()
	for i in range(len(a)):
		table[(i * N) % len(a)] = a[i]
	return list(table)

assert newStack(list(range(10))) == [9, 8, 7, 6, 5, 4, 3, 2, 1, 0]
assert cut(list(range(10)), 3) == [3, 4, 5, 6, 7, 8, 9, 0, 1, 2]
assert cut(list(range(10)), -4) == [6, 7, 8, 9, 0, 1, 2, 3, 4, 5]
assert increment(list(range(10)), 3) == [0, 7, 4, 1, 8, 5, 2, 9, 6, 3]

incrementPattern = 'deal with increment (\\d+)'
cutPattern = 'cut (-?\\d+)'
newStackPattern = 'deal into new stack'

lines = []
with open('input.txt', 'r') as f:
	lines = f.readlines()


deck = list(range(10007))

for l in lines:
	if(m := re.search(incrementPattern, l)):
		N = int(m.group(1))
		deck = increment(deck, N)
	elif(m := re.search(cutPattern, l)):
		N = int(m.group(1))
		deck = cut(deck, N)
	elif(re.search(newStackPattern, l)):
		deck = newStack(deck)

# print(deck)

print(deck.index(2019))

deck = list(range(119315717514047))

for _ in range(101741582076661):
	for l in lines:
		if(m := re.search(incrementPattern, l)):
			N = int(m.group(1))
			deck = increment(deck, N)
		elif(m := re.search(cutPattern, l)):
			N = int(m.group(1))
			deck = cut(deck, N)
		elif(re.search(newStackPattern, l)):
			deck = newStack(deck)
	
print(deck(2020))